(function () {
  'use strict';

  var QUIZ_SELECTOR = '[data-jv-quiz]';

  function onReady(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback, { once: true });
      return;
    }

    callback();
  }

  function createElement(tagName, className, text) {
    var element = document.createElement(tagName);

    if (className) {
      element.className = className;
    }

    if (typeof text === 'string') {
      element.textContent = text;
    }

    return element;
  }

  function normalizeText(value, fallback) {
    if (typeof value !== 'string') {
      return fallback || '';
    }

    var trimmed = value.trim();
    return trimmed || fallback || '';
  }

  function isSafeReferenceUrl(url) {
    if (typeof url !== 'string') {
      return false;
    }

    var trimmed = url.trim();

    return (
      trimmed.indexOf('#') === 0 ||
      trimmed.indexOf('/') === 0 && trimmed.indexOf('//') !== 0 ||
      /^https?:\/\//i.test(trimmed)
    );
  }

  function normalizeQuestions(rawQuestions) {
    if (!Array.isArray(rawQuestions)) {
      return [];
    }

    return rawQuestions
      .map(function (question) {
        var answers = Array.isArray(question.answers) ? question.answers : [];
        var normalizedAnswers = answers
          .map(function (answer) {
            return {
              text: normalizeText(answer.text),
              correct: Boolean(answer.correct),
              message: normalizeText(answer.message),
            };
          })
          .filter(function (answer) {
            return answer.text;
          });

        return {
          question: normalizeText(question.question),
          reference: normalizeText(question.reference),
          referenceUrl: isSafeReferenceUrl(question.referenceUrl)
            ? question.referenceUrl.trim()
            : '',
          answers: normalizedAnswers,
        };
      })
      .filter(function (question) {
        return question.question && question.answers.length > 1;
      });
  }

  function renderError(root, message) {
    root.innerHTML = '';
    var error = createElement('div', 'jv-quiz__error');
    error.appendChild(createElement('strong', '', 'Quiz configuration error'));
    error.appendChild(createElement('p', '', message));
    root.appendChild(error);
  }

  function launchConfetti() {
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');

    if (!context) {
      return;
    }

    var colors = ['#77B0DE', '#198754', '#ffc107', '#ffffff'];
    var particles = [];
    var particleCount = 120;
    var duration = 1800;
    var startTime = performance.now();
    var animationFrameId = null;

    canvas.className = 'jv-quiz__confetti-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas);

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function randomBetween(min, max) {
      return Math.random() * (max - min) + min;
    }

    function createParticle() {
      return {
        x: randomBetween(0, canvas.width),
        y: randomBetween(-canvas.height * 0.25, 0),
        size: randomBetween(6, 11),
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: randomBetween(0, Math.PI * 2),
        rotationSpeed: randomBetween(-0.18, 0.18),
        velocityX: randomBetween(-1.9, 1.9),
        velocityY: randomBetween(3.2, 7.8),
        opacity: 1,
      };
    }

    function cleanup() {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }

      window.removeEventListener('resize', resizeCanvas);
      canvas.remove();
    }

    function drawFrame(now) {
      var elapsed = now - startTime;
      var fadeStart = duration * 0.62;

      context.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(function (particle) {
        if (elapsed > fadeStart) {
          particle.opacity = Math.max(0, 1 - (elapsed - fadeStart) / (duration - fadeStart));
        }

        particle.x += particle.velocityX;
        particle.y += particle.velocityY;
        particle.rotation += particle.rotationSpeed;

        context.save();
        context.globalAlpha = particle.opacity;
        context.translate(particle.x, particle.y);
        context.rotate(particle.rotation);
        context.fillStyle = particle.color;
        context.fillRect(
          -particle.size / 2,
          -particle.size / 2,
          particle.size,
          particle.size * 0.62
        );
        context.restore();
      });

      if (elapsed < duration) {
        animationFrameId = window.requestAnimationFrame(drawFrame);
        return;
      }

      cleanup();
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    for (var index = 0; index < particleCount; index += 1) {
      particles.push(createParticle());
    }

    animationFrameId = window.requestAnimationFrame(drawFrame);
  }

  function updateProgress(root, state) {
    var answeredCount = state.answers.filter(function (answer) {
      return answer !== null;
    }).length;

    var correctCount = state.answers.filter(function (answer) {
      return answer && answer.correct;
    }).length;

    var incorrectCount = answeredCount - correctCount;
    var totalCount = state.questions.length;
    var correctPercent = totalCount ? (correctCount / totalCount) * 100 : 0;
    var answeredPercent = totalCount ? (answeredCount / totalCount) * 100 : 0;

    if (state.scoreLabel) {
      state.scoreLabel.textContent = correctCount + '/' + totalCount + ' correct';
    }

    if (state.statusLabel) {
      state.statusLabel.textContent =
        answeredCount + '/' + totalCount +
        ' answered · ' + correctCount + ' correct · ' + incorrectCount + ' incorrect';
    }

    if (state.progressBar) {
      state.progressBar.style.setProperty('--jv-quiz-correct-end', correctPercent + '%');
      state.progressBar.style.setProperty('--jv-quiz-answered-end', answeredPercent + '%');
      state.progressBar.setAttribute('aria-valuenow', answeredCount);
      state.progressBar.setAttribute(
        'aria-valuetext',
        answeredCount + ' of ' + totalCount +
        ' answered. ' + correctCount + ' correct and ' + incorrectCount + ' incorrect.'
      );
    }
  }

  function appendReference(feedbackBody, question) {
    if (!question.reference) {
      return;
    }

    var reference = createElement('p', 'jv-quiz__reference');
    var prefix = createElement('span', 'jv-quiz__reference-label', 'Reference: ');
    reference.appendChild(prefix);

    if (question.referenceUrl) {
      var link = createElement('a', '', question.reference);
      link.href = question.referenceUrl;
      reference.appendChild(link);
    } else {
      reference.appendChild(document.createTextNode(question.reference));
    }

    feedbackBody.appendChild(reference);
  }

  function finishQuiz(root, state) {
    var correctCount = state.answers.filter(function (answer) {
      return answer && answer.correct;
    }).length;

    var perfectScore = correctCount === state.questions.length;

    state.summary.classList.remove('d-none', 'is-perfect', 'is-review-needed');
    state.summary.classList.add(perfectScore ? 'is-perfect' : 'is-review-needed');
    state.summaryTitle.textContent = perfectScore
      ? 'Great job — all answers are correct.'
      : 'Quiz completed.';
    state.summaryText.textContent =
      'You scored ' + correctCount + ' out of ' + state.questions.length + '. ' +
      (perfectScore
        ? 'You understood the key points from this post.'
        : 'Review the references above and try the quiz again if needed.');

    root.classList.add('is-completed');

    if (perfectScore) {
      launchConfetti();
    }
  }

  function resetQuiz(root, state) {
    state.answers = state.questions.map(function () {
      return null;
    });
    state.currentIndex = 0;

    state.questionCards.forEach(function (card, index) {
      card.hidden = index !== 0;
      card.classList.remove('is-answered', 'is-correct', 'is-incorrect');

      var options = card.querySelectorAll('.jv-quiz__answer-option');
      options.forEach(function (option) {
        option.classList.remove('is-selected', 'is-correct', 'is-incorrect');
      });

      var inputs = card.querySelectorAll('.jv-quiz__answer-input');
      inputs.forEach(function (input) {
        input.disabled = false;
        input.checked = false;
      });

      var feedback = card.querySelector('.jv-quiz__feedback');
      feedback.hidden = true;
      feedback.classList.remove('is-correct', 'is-incorrect');
      feedback.innerHTML = '';
    });

    state.summary.classList.add('d-none');
    state.summary.classList.remove('is-perfect', 'is-review-needed');
    root.classList.remove('is-completed');
    updateProgress(root, state);
  }

  function handleAnswer(root, state, questionIndex, answerIndex) {
    if (state.answers[questionIndex] !== null) {
      return;
    }

    var question = state.questions[questionIndex];
    var selectedAnswer = question.answers[answerIndex];
    var isCorrect = Boolean(selectedAnswer.correct);
    var card = state.questionCards[questionIndex];
    var options = card.querySelectorAll('.jv-quiz__answer-option');
    var inputs = card.querySelectorAll('.jv-quiz__answer-input');
    var feedback = card.querySelector('.jv-quiz__feedback');

    state.answers[questionIndex] = {
      correct: isCorrect,
      selectedAnswerIndex: answerIndex,
    };

    inputs.forEach(function (input, index) {
      input.checked = index === answerIndex;
      input.disabled = true;
    });

    options.forEach(function (option, index) {
      var optionAnswer = question.answers[index];

      if (index === answerIndex) {
        option.classList.add('is-selected');
      }

      if (optionAnswer.correct) {
        option.classList.add('is-correct');
      }

      if (index === answerIndex && !isCorrect) {
        option.classList.add('is-incorrect');
      }
    });

    card.classList.add('is-answered', isCorrect ? 'is-correct' : 'is-incorrect');

    feedback.hidden = false;
    feedback.classList.add(isCorrect ? 'is-correct' : 'is-incorrect');
    feedback.innerHTML = '';

    var feedbackTitle = createElement(
      'strong',
      'jv-quiz__feedback-title',
      isCorrect ? 'Correct answer' : 'Not quite'
    );
    var feedbackText = createElement(
      'p',
      'jv-quiz__feedback-text',
      selectedAnswer.message ||
        (isCorrect
          ? 'That is correct.'
          : 'That is not the best answer. Review the reference below and compare the options again.')
    );

    feedback.appendChild(feedbackTitle);
    feedback.appendChild(feedbackText);
    appendReference(feedback, question);

    if (questionIndex + 1 < state.questions.length) {
      state.currentIndex = questionIndex + 1;
      state.questionCards[state.currentIndex].hidden = false;
    } else {
      state.currentIndex = state.questions.length;
      finishQuiz(root, state);
    }

    updateProgress(root, state);
  }

  function buildQuiz(root, config, questions) {
    var state = {
      questions: questions,
      answers: questions.map(function () {
        return null;
      }),
      currentIndex: 0,
      questionCards: [],
      progressBar: null,
      scoreLabel: null,
      statusLabel: null,
      summary: null,
      summaryTitle: null,
      summaryText: null,
    };

    root.innerHTML = '';

    var wrapper = createElement('div', 'jv-quiz__inner');
    var header = createElement('div', 'jv-quiz__header');
    var headerCopy = createElement('div', 'jv-quiz__header-copy');
    var eyebrow = createElement('p', 'jv-quiz__eyebrow', normalizeText(config.eyebrow, 'Knowledge check'));
    var title = createElement('h2', 'jv-quiz__title', normalizeText(config.title, 'Check your understanding'));
    var intro = createElement(
      'p',
      'jv-quiz__intro',
      normalizeText(config.intro, 'Answer the questions below to check if you understood the key points from this post.')
    );

    state.scoreLabel = createElement('div', 'jv-quiz__score', '0/' + questions.length + ' correct');
    state.statusLabel = createElement('p', 'jv-quiz__status');

    headerCopy.appendChild(eyebrow);
    headerCopy.appendChild(title);
    headerCopy.appendChild(intro);
    header.appendChild(headerCopy);
    header.appendChild(state.scoreLabel);

    state.progressBar = createElement('div', 'jv-quiz__progress');
    state.progressBar.setAttribute('role', 'progressbar');
    state.progressBar.setAttribute('aria-label', 'Quiz progress');
    state.progressBar.setAttribute('aria-valuemin', '0');
    state.progressBar.setAttribute('aria-valuemax', String(questions.length));
    state.progressBar.setAttribute('aria-valuenow', '0');

    wrapper.appendChild(header);
    wrapper.appendChild(state.progressBar);
    wrapper.appendChild(state.statusLabel);

    var questionList = createElement('div', 'jv-quiz__questions');

    questions.forEach(function (question, questionIndex) {
      var card = createElement('section', 'jv-quiz__question');
      card.hidden = questionIndex !== 0;
      card.setAttribute('aria-labelledby', root.id + '-question-' + questionIndex);

      var questionMeta = createElement(
        'p',
        'jv-quiz__question-meta',
        'Question ' + (questionIndex + 1) + ' of ' + questions.length
      );
      var questionTitle = createElement('h3', 'jv-quiz__question-title', question.question);
      questionTitle.id = root.id + '-question-' + questionIndex;

      var answerList = createElement('div', 'jv-quiz__answers');
      answerList.setAttribute('role', 'radiogroup');
      answerList.setAttribute('aria-labelledby', questionTitle.id);

      question.answers.forEach(function (answer, answerIndex) {
        var optionId = root.id + '-question-' + questionIndex + '-answer-' + answerIndex;
        var label = createElement('label', 'jv-quiz__answer-option');
        var input = createElement('input', 'jv-quiz__answer-input');
        var answerText = createElement('span', 'jv-quiz__answer-text', answer.text);

        input.type = 'radio';
        input.id = optionId;
        input.name = root.id + '-question-' + questionIndex;
        input.value = String(answerIndex);

        input.addEventListener('change', function () {
          handleAnswer(root, state, questionIndex, answerIndex);
        });

        label.setAttribute('for', optionId);
        label.appendChild(input);
        label.appendChild(answerText);
        answerList.appendChild(label);
      });

      var feedback = createElement('div', 'jv-quiz__feedback');
      feedback.hidden = true;
      feedback.setAttribute('aria-live', 'polite');

      card.appendChild(questionMeta);
      card.appendChild(questionTitle);
      card.appendChild(answerList);
      card.appendChild(feedback);
      questionList.appendChild(card);
      state.questionCards.push(card);
    });

    wrapper.appendChild(questionList);

    state.summary = createElement('div', 'jv-quiz__summary d-none');
    state.summary.setAttribute('aria-live', 'polite');
    state.summaryTitle = createElement('strong', 'jv-quiz__summary-title');
    state.summaryText = createElement('p', 'jv-quiz__summary-text');
    var resetButton = createElement('button', 'btn btn-outline-primary jv-quiz__reset', 'Try again');
    resetButton.type = 'button';
    resetButton.addEventListener('click', function () {
      resetQuiz(root, state);
    });

    state.summary.appendChild(state.summaryTitle);
    state.summary.appendChild(state.summaryText);
    state.summary.appendChild(resetButton);
    wrapper.appendChild(state.summary);

    root.appendChild(wrapper);
    updateProgress(root, state);
  }

  function initQuiz(root) {
    if (root.dataset.jvQuizInitialized === 'true') {
      return;
    }

    root.dataset.jvQuizInitialized = 'true';

    var dataElement = root.querySelector('.jv-quiz__data');

    if (!dataElement) {
      renderError(root, 'The quiz shortcode is missing its JSON configuration.');
      return;
    }

    var config;

    try {
      config = JSON.parse(dataElement.textContent.trim());
    } catch (error) {
      renderError(root, 'The quiz JSON could not be parsed. Check commas, quotes and brackets in the shortcode.');
      return;
    }

    var questions = normalizeQuestions(config.questions);

    if (!questions.length) {
      renderError(root, 'Add at least one valid question with two or more answers.');
      return;
    }

    buildQuiz(root, config, questions);
  }

  function initAllQuizzes() {
    document.querySelectorAll(QUIZ_SELECTOR).forEach(initQuiz);
  }

  onReady(initAllQuizzes);
})();

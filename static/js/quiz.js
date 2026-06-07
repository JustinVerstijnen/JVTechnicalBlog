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

  function updateProgress(root, state) {
    var answeredCount = state.answers.filter(function (answer) {
      return answer !== null;
    }).length;

    var correctCount = state.answers.filter(function (answer) {
      return answer && answer.correct;
    }).length;

    if (state.scoreLabel) {
      state.scoreLabel.textContent = correctCount + '/' + state.questions.length + ' correct';
    }

    if (state.statusLabel) {
      state.statusLabel.textContent =
        answeredCount + '/' + state.questions.length +
        ' answered · ' + correctCount + '/' + state.questions.length + ' correct';
    }

    state.progressSegments.forEach(function (segment, index) {
      segment.classList.remove('is-correct', 'is-incorrect', 'is-current');
      segment.setAttribute('aria-label', 'Question ' + (index + 1) + ' not answered yet');

      if (state.answers[index]) {
        segment.classList.add(state.answers[index].correct ? 'is-correct' : 'is-incorrect');
        segment.setAttribute(
          'aria-label',
          'Question ' + (index + 1) + ': ' + (state.answers[index].correct ? 'correct' : 'incorrect')
        );
        return;
      }

      if (index === state.currentIndex) {
        segment.classList.add('is-current');
        segment.setAttribute('aria-label', 'Question ' + (index + 1) + ': current question');
      }
    });
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

    state.summary.classList.remove('d-none', 'is-perfect', 'is-review-needed');
    state.summary.classList.add(correctCount === state.questions.length ? 'is-perfect' : 'is-review-needed');
    state.summaryTitle.textContent =
      correctCount === state.questions.length ? 'Great job — all answers are correct.' : 'Quiz completed.';
    state.summaryText.textContent =
      'You scored ' + correctCount + ' out of ' + state.questions.length + '. ' +
      (correctCount === state.questions.length
        ? 'You understood the key points from this post.'
        : 'Review the references above and try the quiz again if needed.');

    root.classList.add('is-completed');
  }

  function resetQuiz(root, state) {
    state.answers = state.questions.map(function () {
      return null;
    });
    state.currentIndex = 0;

    state.questionCards.forEach(function (card, index) {
      card.hidden = index !== 0;
      card.classList.remove('is-answered', 'is-correct', 'is-incorrect');

      var buttons = card.querySelectorAll('.jv-quiz__answer');
      buttons.forEach(function (button) {
        button.disabled = false;
        button.classList.remove('is-selected', 'is-correct', 'is-incorrect');
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
    var buttons = card.querySelectorAll('.jv-quiz__answer');
    var feedback = card.querySelector('.jv-quiz__feedback');

    state.answers[questionIndex] = {
      correct: isCorrect,
      selectedAnswerIndex: answerIndex,
    };

    buttons.forEach(function (button, index) {
      var buttonAnswer = question.answers[index];
      button.disabled = true;

      if (index === answerIndex) {
        button.classList.add('is-selected');
      }

      if (buttonAnswer.correct) {
        button.classList.add('is-correct');
      }

      if (index === answerIndex && !isCorrect) {
        button.classList.add('is-incorrect');
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
      progressSegments: [],
      questionCards: [],
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

    var progress = createElement('div', 'jv-quiz__progress');
    progress.setAttribute('role', 'list');
    progress.setAttribute('aria-label', 'Quiz progress');

    questions.forEach(function (_, index) {
      var segment = createElement('span', 'jv-quiz__progress-segment');
      segment.setAttribute('role', 'listitem');
      segment.setAttribute('aria-label', 'Question ' + (index + 1) + ' not answered yet');
      progress.appendChild(segment);
      state.progressSegments.push(segment);
    });

    wrapper.appendChild(header);
    wrapper.appendChild(progress);
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

      question.answers.forEach(function (answer, answerIndex) {
        var button = createElement('button', 'jv-quiz__answer', answer.text);
        button.type = 'button';
        button.addEventListener('click', function () {
          handleAnswer(root, state, questionIndex, answerIndex);
        });
        answerList.appendChild(button);
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

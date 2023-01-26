var vueInstance = new Vue({
  el: "#app",
  data: {
    question: "33+44=",
    answerList: [1, 2, 3, 4],
    answer: "",
    myAnswer: "",
    correctAnswers: [],
    incorrectAnswers: [],
    currentTimer: 0,
    defaultConfigs: {
      operators: {
        "+": {
          numberA: 20,
          numberB: 20,
        },
        "-": {
          numberA: 20,
          numberB: 20,
        },
        "*": {
          numberA: 10,
          numberB: 10,
        },
        "/": {
          numberA: 20,
          numberB: 10,
        },
        "%": {
          numberA: 20,
          numberB: 10,
        },
      },
      currentOperation: {
        operator: "+",
        numberA: 0,
        numberB: 0,
      },
      timer: 10,
      isSoundEnable: 1,
    },
    configs: null,
  },
  computed: {
    /**
     * Định dạng đồng hồ đếm ngược theo format 00:00
     * @returns Giá trị timer đã được format
     * Created by: PVLONG(26/01/2023)
     */
    timer() {
      let minutes = Math.trunc(this.currentTimer / 60);
      let second = Math.trunc(this.currentTimer - minutes * 60);
      if (minutes < 10) minutes = `0${minutes}`;
      if (second < 10) second = `0${second}`;
      return `${minutes}:${second}`;
    },

    /**
     * Tính toán số câu hỏi đã trả lời
     * @returns Số câu hỏi đã trả lời
     * Created by: PVLONG(26/01/2023)
     */
    questionCount() {
      return this.correctAnswers.length + this.incorrectAnswers.length;
    },

    /**
     * Tính toán tỷ lệ câu hỏi trả lời đúng
     * @returns tỷ lệ câu hỏi trả lời đúng
     * Created by: PVLONG(26/01/2023)
     */
    successRatio() {
      if (this.questionCount == 0) return 0;
      return Math.round(
        (this.correctAnswers.length * 100) / this.questionCount
      );
    },

    /**
     * Tính toán tỷ lệ câu hỏi trả lời sai
     * @returns tỷ lệ câu hỏi trả lời sai
     * Created by: PVLONG(26/01/2023)
     */
    failureRatio() {
      if (this.questionCount == 0) return 0;
      return 100 - this.successRatio;
    },
  },
  watch: {
    /**
     * Xử lý giảm currentTimer đi 1 sau mỗi 1000ms
     * Created by: PVLONG(26/01/2023)
     */
    currentTimer: {
      handler(value) {
        if (value > 0) {
          setTimeout(() => {
            this.currentTimer--;
          }, 1000);

          // Phát âm thanh
          if (value == 10 && parseInt(this.configs.isSoundEnable)) {
            this.$refs.countDownSound.play();
          }
        }
      },
      immediate: true,
    },

    /**
     * Lắng nghe thay đổi config
     * Created by: PVLONG(26/01/2023)
     */
    configs: {
      handler(value) {
        this.saveConfigs(value);
        this.initQuestion();
      },
      deep: true,
    },

    /**
     * Lắng nghe thay đổi config operator
     * Created by: PVLONG(26/01/2023)
     */
    "configs.currentOperation.operator": {
      handler(value) {
        // Mapping currentOperation với operators config
        let currentOperatorConfig =
          this.configs.operators[this.configs.currentOperation.operator];
        this.configs.currentOperation = {
          ...this.configs.currentOperation,
          ...currentOperatorConfig,
        };
      },
    },
  },
  created() {
    this.initConfig();
  },
  mounted() {
    this.initQuestion();
  },
  methods: {
    /**
     * Khởi tạo config, lấy từ localStorage
     * Created by: PVLONG(26/01/2023)
     */
    initConfig() {
      // Nếu tìm thấy configs từ localstore, khởi tạo config theo local
      if (window) {
        let localConfig = window.localStorage.getItem("configs");
        if (localConfig) {
          this.configs = JSON.parse(localConfig);
        }
      } else {
        // Nếu không tìm thấy từ localStorage, khởi tạo config mặc định
        this.configs = this.defaultConfigs;
      }

      // Mapping currentOperation với operators config
      let currentOperatorConfig =
        this.configs.operators[this.configs.currentOperation.operator];
      this.configs.currentOperation = {
        ...this.configs.currentOperation,
        ...currentOperatorConfig,
      };

      // Set timer
      this.currentTimer = this.configs.timer * 60;
    },

    /**
     * Khởi tạo câu hỏi
     * Created by: PVLONG(26/01/2023)
     */
    initQuestion() {
      // console.debug(this.configs.currentOperation);
      let operator = this.configs.currentOperation.operator;
      let [numberA, numberB] = this.getValidPairOfNumber();

      let answer = 0;
      switch (operator) {
        case "+":
          answer = numberA + numberB;
          break;
        case "-":
          answer = numberA - numberB;
          break;
        case "*":
          answer = numberA * numberB;
          break;
        case "/":
          answer = numberA / numberB;
          break;
        case "%":
          answer = numberA % numberB;
          break;
        default:
          break;
      }
      this.question = `${numberA} ${operator} ${numberB} = `;
      this.answer = answer;

      // Khởi tạo câu trả lời
      this.initAnswers(answer);
    },

    /**
     * Khởi tạo câu trả lời
     * Created by: PVLONG(26/01/2023)
     */
    initAnswers(answer) {
      let newAnswerList = [answer];
      for (let i = 0; i < 3; i++) {
        let incorrectAnswer;
        if (Math.random() < 0.5) {
          incorrectAnswer = answer - this.getRandomNumber(answer - 1);
        } else {
          incorrectAnswer = answer + this.getRandomNumber(answer - 1);
        }
        // console.log("incorrectAnswer", incorrectAnswer);
        newAnswerList.push(incorrectAnswer);
      }
      // newAnswerList.sort((a, b) => a - b);

      this.answerList = this.shuffleArray(newAnswerList);
    },

    /**
     * Xáo trộn mảng
     * @param {*} array
     * @returns Mảng đã được xáo trộn
     * Created by: PVLONG(26/01/2023)
     */
    shuffleArray(array) {
      let currentIndex = array.length,
        randomIndex;

      // While there remain elements to shuffle.
      while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex],
          array[currentIndex],
        ];
      }

      return array;
    },

    /**
     * Lấy cặp số phù hợp
     * Hỗ trợ cho phép chia nguyên
     * Created by: PVLONG(26/01/2023)
     */
    getValidPairOfNumber() {
      let operator = this.configs.currentOperation.operator;
      let numberA = this.configs.currentOperation.numberA
        ? this.configs.currentOperation.numberA
        : 1;
      let numberB = this.configs.currentOperation.numberB
        ? this.configs.currentOperation.numberB
        : 1;
      let firstNumber = this.getRandomNumber(numberA);
      let secondNumber = this.getRandomNumber(numberB);

      switch (operator) {
        case "-":
          while (firstNumber < secondNumber) {
            firstNumber = this.getRandomNumber(numberA);
            secondNumber = this.getRandomNumber(numberB);
          }
          break;
        case "/":
          while (firstNumber % secondNumber != 0) {
            firstNumber = this.getRandomNumber(numberA);
            secondNumber = this.getRandomNumber(numberB);
          }
          break;
        case "%":
          while (firstNumber < secondNumber) {
            firstNumber = this.getRandomNumber(numberA);
            secondNumber = this.getRandomNumber(numberB);
          }
          break;
        default:
          break;
      }

      return [firstNumber, secondNumber];
    },

    /**
     * Lấy số ngẫu nhiên
     * Created by: PVLONG(26/01/2023)
     */
    getRandomNumber(max) {
      let result = Math.ceil(Math.random() * max);
      // console.debug("getRandomNumber", result);
      // while (result == 0) {
      //   result = this.getRandomNumber(max);
      // }
      return result;
    },

    /**
     * Set câu trả lời vào myAnswer
     * @param {*} answer câu trả lời muốn set
     * Created by: PVLONG(26/01/2023)
     */
    setAnswer(answer) {
      this.myAnswer = answer;
    },

    /**
     * Kiểm tra câu trả lời có đúng hay không
     * Created by: PVLONG(26/01/2023)
     */
    checkAnswer() {
      // console.log("checkAnswer", this.answer, this.myAnswer);
      // Kiểm tra kết quả và hiển thị
      let result = this.question + String(this.myAnswer);
      if (this.myAnswer == this.answer) {
        this.correctAnswers.push(result);

        // Phát âm thanh
        if (parseInt(this.configs.isSoundEnable))
          this.$refs.successSound.play();
      } else {
        this.incorrectAnswers.push(result);

        // Phát âm thanh
        if (parseInt(this.configs.isSoundEnable))
          this.$refs.failureSound.play();
      }

      // Reset câu hỏi
      this.initQuestion();
      this.$refs.tabindexStart.focus();
      this.myAnswer = null;
    },

    /**
     * Lưu config vào storage
     * Created by: PVLONG(26/01/2023)
     */
    saveConfigs() {
      // console.log(this.configs);
      if (window) {
        window.localStorage.setItem("configs", JSON.stringify(this.configs));
      }
    },

    /**
     * Xử lý quay lại tabindex trước đó
     * Created by: PVLONG(26/01/2023)
     */
    repeatPreviousTabindex() {
      this.$refs.tabindexEnd.focus();
    },

    /**
     * Xử lý lặp lại tabindex tiếp theo
     * Created by: PVLONG(26/01/2023)
     */
    repeatNextTabindex() {
      this.$refs.tabindexStart.focus();
    },
  },
});

// function myFunction() {
//   vueInstance.message = "John Doe";
// }

<template>
  <div class="layout-default">
    <div class="grid grid-cols-12">
      <div v-if="!gameStarted && !gameEnded" class="col-span-12">
        <!-- 게임 시작  -->
        <div
          class="flex items-center justify-center h-screen sm:border-8 sm:border-wood-dark sm:rounded-md sm:p-8"
        >
          <div class="text-center">
            <img
              class="layout-default h-64 w-full"
              src="@/assets/images/quiz.png"
              alt="quiz image"
            />
            <div
              @click="startGame"
              class="text-5xl sm:text-7xl lg:text-8xl PatricianCapitals-font cursor-pointer hover:shadow-xl transition duration-200 ease-in-out transform hover:scale-105 my-2"
            >
              GAME START
            </div>
            <!-- <p class="text-lg mb-8">
              게임을 시작하려면 아래의 버튼을 클릭하세요.
            </p>
            <button
              @click="startGame"
              class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition duration-200 ease-in-out transform hover:scale-105"
            >
              Game Start
            </button> -->
          </div>
        </div>
      </div>

      <div
        v-if="gameStarted && !gameEnded"
        class="col-span-12 md:col-span-9 sm:border-4 sm:border-wood-dark"
      >
        <!-- 게임 문제  -->
        <div class="md:h-full" v-if="currentQuizIndex < quizQuestions.length">
          <div
            class="md:ml-10 md:mr-5 mt-7 p-3 pb-10 bg-gray-200 rounded-xl font-bold shadow-xl"
          >
            <span class="text-3xl">Q.</span>
            {{ quizQuestions[currentQuizIndex].question }}
          </div>
          <div v-if="isChoice4Quiz()">
            <div
              v-for="(option, i) in quizQuestions[currentQuizIndex].options"
              :key="i"
              @click="changeSelectedAnswerIndex(i)"
              :id="'answer_' + currentQuizIndex + '_' + i"
              :class="{
                'bg-yellow-200': selectedAnswerIndex === i,
                'bg-gray-200': selectedAnswerIndex !== i,
              }"
              class="md:ml-10 md:mr-5 my-5 md:my-10 p-3 cursor-pointer bg-gray-200 rounded-xl font-bold shadow-xl"
            >
              {{ i + 1 }}. {{ option }}
            </div>
          </div>

          <!-- OX 퀴즈 문제 형식 -->
          <div
            v-else
            class="sm:h-3/5 md:ml-10 md:mr-5 mt-7 p-3 pb-10 grid grid-cols-3 gap-4 bg-gray-100 shadow-xl rounded-xl"
          >
            <div class="p-4 flex items-center justify-center">
              <p
                @click="changeSelectedAnswerIndex(0)"
                :class="{ 'text-yellow-300': selectedAnswerIndex === 0 }"
                class="text-9xl cursor-pointer"
              >
                O
              </p>
            </div>
            <div class="p-4 flex items-center justify-center">
              <p class="text-9xl">/</p>
            </div>
            <div class="p-4 flex items-center justify-center">
              <p
                @click="changeSelectedAnswerIndex(1)"
                :class="{ 'text-yellow-300': selectedAnswerIndex === 1 }"
                class="text-9xl cursor-pointer"
              >
                X
              </p>
            </div>
          </div>

          <div class="flex justify-between mt-5">
            <div class="text-xl ml-10 text-red-600 font-bold px-5">
              {{ timer }}
            </div>
            <div
              class="mr-5 cursor-pointer px-10 py-4 bg-green-500 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition duration-200 ease-in-out transform hover:scale-105"
              @click="nextQuestion"
            >
              다음 문제
            </div>
          </div>
        </div>
      </div>

      <!-- 답안 표 -->
      <div
        v-if="gameStarted && !gameEnded"
        class="col-span-12 md:col-span-3 sm:border-4 sm:border-l-0 sm:border-wood-dark"
      >
        <div class="max-w-full mt-7 rounded overflow-hidden shadow-lg">
          <!-- 문제 결과 표 -->
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-center whitespace-nowrap text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  번호
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  답 란
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  채점
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr class="text-center" v-for="i in currentQuestionPage" :key="i">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ i + 1 }}
                </td>
                <td
                  class="px-6 py-4 font-bold whitespace-nowrap text-sm text-black"
                >
                  {{
                    selectedAnswers[i].answer !== null
                      ? typeof selectedAnswers[i].answer == "number"
                        ? selectedAnswers[i].answer + 1
                        : selectedAnswers[i].answer
                      : "-"
                  }}
                </td>
                <td
                  class="font-bold"
                  :class="{
                    'px-6 py-4 whitespace-nowrap text-sm text-gray-500':
                      selectedAnswers[i].isCorrect === null,
                    'px-6 py-4 whitespace-nowrap text-sm text-green-500':
                      selectedAnswers[i].isCorrect,
                    'px-6 py-4 whitespace-nowrap text-sm text-red-500':
                      selectedAnswers[i].isCorrect === false,
                  }"
                >
                  {{
                    selectedAnswers[i].isCorrect === null
                      ? "-"
                      : selectedAnswers[i].isCorrect
                      ? "O"
                      : "X"
                  }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div
        v-if="gameEnded"
        class="col-span-12 flex items-center justify-center h-screen"
      >
        <div class="text-center">
          <h1 class="text-4xl sm:text-8xl font-bold mb-4">게임 종료!</h1>
          <p class="text-xl sm:text-4xl my-8">
            당신의 점수는 {{ totalScore }} 점입니다.
          </p>
          <div
            @click="restartGame"
            class="text-4xl sm:text-7xl PatricianCapitals-font cursor-pointer hover:shadow-xl transition duration-200 ease-in-out transform hover:scale-105 mb-2"
          >
            GAME RESTART
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "@/assets/styles.css";

.PatricianCapitals-font {
  font-family: "PatricianCapitals", sans-serif;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loader {
  animation: spin 1s linear infinite;
  border: 6px solid transparent;
  border-top: 6px solid #3490dc; /* 파란색 부분 */
  border-right: 6px solid #3490dc; /* 파란색 부분 */
  border-bottom: 6px solid rgba(244, 238, 238, 0.5); /* 파란색 부분 */
  border-left: 6px solid rgba(244, 238, 238, 0.5); /* 투명 부분 */
  border-radius: 50%;
  width: 96px; /* 너비 */
  height: 96px; /* 높이 */
}
</style>
<script>
export default {
  name: "testVue",
  data() {
    return {
      //문제 항목 클릭 여부
      gameStarted: false,
      gameEnded: false,
      quizQuestions: [
        {
          question: "Spring Bean은 Singleton으로 기본 설정되어 있는가?",
          options: ["O", "X"],
          answer: "O",
          quizType: "OX",
        },
        {
          question: "스프링에서 트랜잭션 관리를 위한 어노테이션은 무엇인가?",
          options: ["Transactional", "Controller", "Service", "Repository"],
          answer: "0",
          quizType: "CHOICE_4",
        },
        {
          question:
            "Spring Boot에서 내장 서버로 사용되는 서블릿 컨테이너는 무엇인가요?",
          options: ["Tomcat", "Jetty", "Undertow", "WebLogic"],
          answer: "0",
          quizType: "CHOICE_4",
        },
        {
          question:
            "Spring Boot에서 내장 서버로 사용되는 서블릿 컨테이너는 무엇인가요?",
          options: ["Tomcat", "Jetty", "Undertow", "WebLogic"],
          answer: "0",
          quizType: "CHOICE_4",
        },
        {
          question:
            "Spring Boot에서 내장 서버로 사용되는 서블릿 컨테이너는 무엇인가요?",
          options: ["Tomcat", "Jetty", "Undertow", "WebLogic"],
          answer: "0",
          quizType: "CHOICE_4",
        },
        {
          question:
            "Spring Boot에서 내장 서버로 사용되는 서블릿 컨테이너는 무엇인가요?",
          options: ["Tomcat", "Jetty", "Undertow", "WebLogic"],
          answer: "0",
          quizType: "CHOICE_4",
        },
        {
          question:
            "Spring Boot에서 내장 서버로 사용되는 서블릿 컨테이너는 무엇인가요?",
          options: ["Tomcat", "Jetty", "Undertow", "WebLogic"],
          answer: "0",
          quizType: "CHOICE_4",
        },
        {
          question:
            "Spring Boot에서 내장 서버로 사용되는 서블릿 컨테이너는 무엇인가요?",
          options: ["Tomcat", "Jetty", "Undertow", "WebLogic"],
          answer: "0",
          quizType: "CHOICE_4",
        },
        {
          question:
            "Spring Boot에서 내장 서버로 사용되는 서블릿 컨테이너는 무엇인가요?",
          options: ["Tomcat", "Jetty", "Undertow", "WebLogic"],
          answer: "0",
          quizType: "CHOICE_4",
        },
        {
          question:
            "Spring Boot에서 내장 서버로 사용되는 서블릿 컨테이너는 무엇인가요?",
          options: ["Tomcat", "Jetty", "Undertow", "WebLogic"],
          answer: "0",
          quizType: "CHOICE_4",
        },
        {
          question:
            "Spring Boot에서 내장 서버로 사용되는 서블릿 컨테이너는 무엇인가요?",
          options: ["Tomcat", "Jetty", "Undertow", "WebLogic"],
          answer: "0",
          quizType: "CHOICE_4",
        },
        {
          question:
            "Spring Boot에서 내장 서버로 사용되는 서블릿 컨테이너는 무엇인가요?",
          options: ["Tomcat", "Jetty", "Undertow", "WebLogic"],
          answer: "0",
          quizType: "CHOICE_4",
        },

        // 다른 퀴즈 추가
      ],
      currentQuizIndex: 0,
      selectedAnswerIndex: null,
      totalScore: 0,
      score: 33,
      timer: 0,
      intervalId: null,
      selectedAnswers: [],
      currentPage: 0,
      perPage: 10,
    };
  },
  mounted() {
    for (var i = 0; i < this.quizQuestions.length; i++) {
      this.selectedAnswers[i] = {
        answer: null,
        isCorrect: null,
      };
    }
  },
  computed: {
    currentQuestionPage() {
      console.log("currentQuestionsPage " + this.currentQuizIndex / 10);
      const start = this.currentPage * 10;
      const end =
        (this.currentPage + 1) * 10 < this.quizQuestions.length
          ? (this.currentPage + 1) * 10
          : this.quizQuestions.length;
      console.log(end);
      return Array.from({ length: end - start }, (_, i) => i + start);
    },
  },
  methods: {
    startGame() {
      this.gameStarted = true;
      console.log("게임이 시작됩니다!");
      this.startTimer();
    },
    nextPage() {
      this.currentPage++;
    },
    nextQuestion() {
      if (Math.floor(this.currentQuizIndex / 10) != this.currentPage)
        this.nextPage();
      if (this.selectedAnswerIndex !== null) {
        console.log(
          "정답: " + this.quizQuestions[this.currentQuizIndex].answer
        );
        this.totalScore = this.addScore(
          this.totalScore,
          this.selectedAnswerIndex
        );

        this.selectedAnswerIndex = null;

        console.log("점수: " + this.totalScore);
      }
      //채점하기
      this.selectedAnswers[this.currentQuizIndex].isCorrect = this.checkAnswer(
        this.selectedAnswers[this.currentQuizIndex].answer
      );

      //다음문제로 넘어가기
      if (this.currentQuizIndex < this.quizQuestions.length) {
        this.currentQuizIndex++;
        this.startTimer();
      }
      //게임 종료 후
      if (this.currentQuizIndex == this.quizQuestions.length) {
        this.endGame();
      }
    },
    checkAnswer(selectedAnswer) {
      return (
        this.quizQuestions[this.currentQuizIndex].answer ===
        String(selectedAnswer)
      );
    },
    addScore(totalScore, selectedAnswer) {
      if (!this.isChoice4Quiz()) {
        selectedAnswer = this.$store.getters.getOXAnswer(
          this.selectedAnswerIndex
        );
        console.log("addScroe : selected answer : ", selectedAnswer);
      }
      if (this.checkAnswer(selectedAnswer)) totalScore += this.score;
      return totalScore;
    },

    startTimer() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }
      // 초기화
      this.timer = 10;
      // 1초마다 타이머 업데이트
      this.intervalId = setInterval(() => {
        if (this.timer > 0) {
          this.timer--;
        } else {
          clearInterval(this.intervalId); // 타이머가 0이 되면 중지
          this.nextQuestion();
        }
      }, 1000);
    },

    changeSelectedAnswerIndex(selectedAnswerIndex) {
      this.selectedAnswerIndex = selectedAnswerIndex;
      // this.selectedAnswers[this.currentQuizIndex]
      var selectedAnswer = 0;
      if (this.isChoice4Quiz()) {
        selectedAnswer = selectedAnswerIndex;
      } else {
        selectedAnswer = this.$store.getters.getOXAnswer(
          this.selectedAnswerIndex
        );
        console.log(this.$store.getters.getOXAnswer(this.selectedAnswerIndex));
      }
      this.selectedAnswers[this.currentQuizIndex].answer = selectedAnswer;
    },
    isChoice4Quiz() {
      const quizType = this.quizQuestions[this.currentQuizIndex].quizType;
      return quizType === this.$store.getters.getChoice_4;
    },
    restartGame() {
      window.location.reload();
    },
    endGame() {
      this.gameEnded = true;
      this.gameStarted = false;
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }
      console.log(this.score);
      console.log(this.totalScore / this.score);
    },
  },
};
</script>

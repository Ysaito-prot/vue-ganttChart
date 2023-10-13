Vue.createApp({
  data: function () {
    return {
      userInfo: [],
      dragIndex: null,
      dragIndexs: [],
      // 課題2「インデント機能」
      indentW: 12,
      selectedItem: [],
      // 課題3「日数計算」
      planStDateInpt: "",
      planEdDateInpt: "",
      actStDateInpt: "",
      actEdDateInpt: "",
    };
  },
  created: async function () {
    const res = await fetch("./asset/userInfo.json");
    const users = await res.json();
    this.userInfo = users;
    console.log(this.userInfo);
  },
  methods: {
    dragStart: function (index) {
      this.dragIndex = index;
      let itemsaito = document.querySelectorAll(".wrapper")[index];
      itemsaito.classList.add("ui-selected");
    },
    dragEnter: function (index) {
      if (index === this.dragIndex) return;
        let deleteElement = this.userInfo.splice(this.dragIndex, 1)[0];
        this.userInfo.splice(index, 0, deleteElement);
        this.dragIndex = index;
      // 選択解除
      this.selectedItem = [];
      this.classCheck();
    },
    // 選択状態のものを格納
    // 行をクリックした場合
    addItem: function (index) {
      let item = document.querySelectorAll(".task_title")[index];
      this.selectedItem = [];
      this.dragIndexs = [];
      this.selectedItem.push(item);
      this.dragIndexs.push(index);
      this.classCheck();
    },
    // 行をctrlキーを押しながらクリックした場合
    addItem2: function (index) {
      let item = document.querySelectorAll(".task_title")[index];
      if (this.selectedItem.includes(item) === false) {
        this.selectedItem.push(item);
        this.dragIndexs.push(index);
      }
      this.classCheck();
    },
    // 課題2「インデント機能」
    indentRight: function () {
      if (this.selectedItem != []) {
        for (i = 0; i < this.selectedItem.length; i++) {
          let styleObj = window.getComputedStyle(this.selectedItem[i]);
          let indent = parseInt(styleObj.textIndent) + this.indentW;
          if (indent <= this.indentW * 3)
            this.selectedItem[i].style.textIndent = indent + "px";
        }
      }
    },
    indentLeft: function () {
      if (this.selectedItem != []) {
        for (i = 0; i < this.selectedItem.length; i++) {
          let styleObj = window.getComputedStyle(this.selectedItem[i]);
          let indent = parseInt(styleObj.textIndent) - this.indentW;
          if (0 <= indent) {
            this.selectedItem[i].style.textIndent = indent + "px";
          }
        }
      }
    },
    // 課題3「日数計算」
    changePlanDate: function (index) {
      // 選択された日付取得
      let setPlanStDate = document.querySelectorAll(".planSt")[index].value;
      this.planStDateInpt = setPlanStDate.replaceAll("-", "/");
      let setPlanEdDate = document.querySelectorAll(".planEd")[index].value;
      this.planEdDateInpt = setPlanEdDate.replaceAll("-", "/");
      let planStDay = new Date(this.planStDateInpt);
      let planEdDay = new Date(this.planEdDateInpt);
      // 選択された行の日数セル取得
      let planDayOutpt = document.querySelectorAll(".planDif")[index];
      //差日を求める（86,400,000ミリ秒＝１日）
      if (this.planStDateInpt !== "" && this.planEdDateInpt !== "") {
        planDayOutpt.innerText = (planEdDay - planStDay) / 86400000;
        this.barEnd(".planBar", planEdDay, planStDay, index);
      }
      this.barStart(index, setPlanStDate, ".planBar");
    },
    changeActDate: function (index) {
      // 選択された日付取得
      let setActStDate = document.querySelectorAll(".actSt")[index].value;
      this.actStDateInpt = setActStDate.replaceAll("-", "/");
      let setActEdDate = document.querySelectorAll(".actEd")[index].value;
      this.actEdDateInpt = setActEdDate.replaceAll("-", "/");
      let actStDay = new Date(this.actStDateInpt);
      let actEdDay = new Date(this.actEdDateInpt);
      // 選択された行の日数セル取得
      let actDayOutpt = document.querySelectorAll(".actDif")[index];
      //差日を求める（86,400,000ミリ秒＝１日）
      if (this.actStDateInpt !== "" && this.actEdDateInpt !== "") {
        actDayOutpt.innerText = (actEdDay - actStDay) / 86400000;
        this.barEnd(".actBar", actEdDay, actStDay, index);
      }
      this.barStart(index, setActStDate, ".actBar");
    },
    // 課題4「開始日変更時バー移動」
    barStart: function (x, y, z) {
      let target = document.querySelectorAll(".wrapper")[x];
      let dateLength = document.querySelectorAll(".column_header .col_day");
      let targetBar = target.querySelectorAll(z)[0];
      for (i = 0; i < dateLength.length; i++) {
        if (dateLength[i].id === y) {
          targetBar.style.marginLeft = 20 * i + "px";
        }
      }
    },
    // 課題5「終了日変更時バー移動」(予定)
    barEnd: function (x, y, z, a) {
      let targetBar = document.querySelectorAll(x)[a];
      targetBar.style.width = 20 * ((y - z) / 86400000) + 20 + "px";
    },
    // 課題6「進捗率描画」
    progBar: function (x) {
      let progVal = document.querySelectorAll(".prog")[x].value;
      let progBar = document.querySelectorAll(".progBar")[x];
      progBar.style.width = progVal + "%";
    },
    // 選択状態確認
    classCheck: function() {
        let allLows = document.querySelectorAll(".wrapper");
        let taskTitle = document.querySelectorAll(".task_title");
        for (i = 0; i < taskTitle.length; i++){
          allLows[i].classList.remove("ui-selected");
          for (j = 0; j < this.selectedItem.length; j++){
            if (taskTitle[i] === this.selectedItem[j]) {
              allLows[i].classList.add("ui-selected");
            }
          }
        }
    },
  },
}).mount("#app");

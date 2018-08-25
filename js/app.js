$(
  (function() {
    let model = {
      init: function() {
        this.totalDays = 13;
        this.students = [
          {
            name: "Slappy Frog",
            ...this.getRandomAttendance()
          },
          {
            name: "Lilly Lizard",
            ...this.getRandomAttendance()
          },
          {
            name: "Paulrus Walrus",
            ...this.getRandomAttendance()
          },
          {
            name: "Gregory Goat",
            ...this.getRandomAttendance()
          },
          {
            name: "Adam Anaconda",
            ...this.getRandomAttendance()
          },
          {
            name: "Wasser Ken",
            ...this.getRandomAttendance()
          }
        ];
      },
      getTotalDays: function() {
        return this.totalDays;
      },
      getStudents: function() {
        return this.students;
      },
      getRandomAttendance: function() {
        let days = [];
        let totalMissingDays = 0;
        for (let i = 1; i <= 13; i++) {
          let value = Math.random() >= 0.5;
          days.push(value);
          if (!value) {
            totalMissingDays += 1;
          }
        }
        return { days, totalMissingDays };
      }
    };

    let octopus = {
      init: function() {
        this.currentEntry = null;
        model.init();
        attendanceView.init();
      },
      getTotalDays: function() {
        return model.getTotalDays();
      },
      getStudents: function() {
        return model.getStudents();
      },
      updateAttendance: function(name, status) {
        model.getStudents().forEach(function(student, index) {
          if (student.name == name) {
            if (status) {
              student.totalMissingDays -= 1;
            } else {
              student.totalMissingDays += 1;
            }
            model.getStudents()[index] = student;
            missingDaysView.render();
          }
        });
      },
      setCurrentEntry: function(entry) {
        this.currentEntry = entry;
      },
      getCurrentEntry: function() {
        return this.currentEntry;
      }
    };

    let attendanceView = {
      init: function() {
        this.render();
      },
      render: function() {
        $("thead > tr").html("");

        $("thead > tr").append("<th class='name-col'>Student Name</th>");
        for (let i = 1; i <= octopus.getTotalDays(); i++) {
          $("thead > tr").append(`<th>${i}</th>`);
        }

        $("tbody").html("");
        octopus.getStudents().forEach(student => {
          let element = $(`<tr class='student'></tr>`)[0];
          $(element).append(`<td class="name-col">${student.name}</td>`);
          for (let i = 0; i < student.days.length; i++) {
            let tdElem = $('<td class="attend-col"></td>');
            $(element).append(tdElem);
            let inputElem = $(
              `<input type="checkbox" ${student.days[i] ? "checked" : ""}>`
            );
            $(inputElem[0]).on(
              "change",
              (function({ element, student }) {
                return function() {
                  octopus.setCurrentEntry({ element, student });
                  $(element)
                    .find(".missed-col")
                    .remove();
                  let isChecked = $(inputElem[0]).prop("checked");
                  octopus.updateAttendance(student.name, isChecked);
                };
              })({ element, student })
            );
            $(tdElem[0]).append(inputElem);
          }
          octopus.setCurrentEntry({ element, student });
          missingDaysView.render();
          $("tbody").append(element);
        });

        $("thead > tr").append("<th class='missed-col'>Days Missed-col</th>");
      }
    };

    let missingDaysView = {
      render() {
        let element = octopus.getCurrentEntry().element;
        let student = octopus.getCurrentEntry().student;
        $(element).append(
          `<td class="missed-col">${student.totalMissingDays}</td>`
        );
      }
    };

    octopus.init();
  })()
);

const divMain = document.createElement('div');
divMain.classList.add('main');
const body = document.querySelector("body");
body.appendChild(divMain);

const header = document.createElement('h1')
header.textContent = "Морской Бой";
divMain.appendChild(header);

const divGameArea = document.createElement('div')
divGameArea.id = ('gameArea')
divMain.appendChild(divGameArea);

let buttonGenerate = document.createElement("button");
buttonGenerate.textContent = "Cгенерировать поле";
buttonGenerate.className = "buttonGenerate";
buttonGenerate.addEventListener("click", GenerateFieldS);
divGameArea.appendChild(buttonGenerate);


let form = document.createElement("form");
form.action = "play.html";
let buttonBack = document.createElement("button")
buttonBack.className = "buttonBack"
buttonBack.textContent = "Назад"
form.appendChild(buttonBack);
divMain.appendChild(form);




function ProtoPlayer(Name) {
    this.name = Name;
    this.letters = ["А", "Б", "В", "Г", "Д", "Е", "Ж", "З", "И", "К"]; // буквы столбцов
    this.fieldSize = 10;
    this.ShipConf = {
        1: 4, //четырехпалубные
        2: 3, //трехпалубные
        3: 2, //двухпалубные
        4: 1 //однопалубные
    }
    this.Area
}

ProtoPlayer.prototype = {
    isValidPosition: function (row, col) {
        if (row < 0 || col < 0 || row >= this.fieldSize || col >= this.fieldSize) { return false; }
        if (this.Area[row][col] !== '0') { return false; } //проверка, если ли в этой клетке корабль
        return true;
    },
    // функция создания поля для прото-игрока
    createField: function () {
        const FieldFront = document.createElement("table");
        FieldFront.id = this.name + "Field";
        FieldFront.classList.add("gameField");

        // Заголовок с буквами столбцов
        const FieldHeaderRow = document.createElement("tr");
        FieldHeaderRow.innerHTML = "<th></th>"; // пустая ячейка в верхнем левом углу
        FieldFront.appendChild(FieldHeaderRow);
        divGameArea.appendChild(FieldFront);

        let FieldBack = [];


        for (let i = 0; i < this.fieldSize; i++) {

            const columnLetter = document.createElement("th");
            columnLetter.textContent = this.letters[i];
            FieldHeaderRow.appendChild(columnLetter);

            const row = document.createElement("tr");
            row.innerHTML = `<th>${i + 1}</th>`; // номер строки
            row.id = `${i}`;


            FieldBack.push([]);
            for (let j = 0; j < this.fieldSize; j++) {
                FieldBack[i].push('0'); // 0 будет говорить о том, что в этой клетке нет корабля

                // Создание ячеек для прото-игрока
                let cell = document.createElement("td");
                cell.id = `${10 * i + j}`;
                row.appendChild(cell);
            }
            FieldFront.appendChild(row);
        }


        this.Area = FieldBack;
    },
    // функция для размещения 
    placeShipAuto: function (shipSize) {
        while (true) {
            let row = Math.floor(Math.random() * this.fieldSize);
            let col = Math.floor(Math.random() * this.fieldSize);
            let orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';

            if (orientation === 'horizontal') {
                if (col + shipSize > this.fieldSize) {
                    continue;
                }
                else {
                    for (let i = 0; i < shipSize; i++) {
                        if (!this.isValidPosition(row, col + i)) {
                            break;
                        }
                    }
                    console.log("shipSize:"+shipSize);
                    for (let j = 0; j < shipSize; j++) {
                        this.Area[row][col + j] = "1";
                        let cellOfShip = document.getElementById(`${10 * row + col + j}`);
                        console.log("cellOfShip:"+cellOfShip);
                        console.log("cellOfShip.id:"+cellOfShip.id);
                        

                    }
                    break;
                }
            }
            else {
                console.log("vertical")
                if (row + shipSize > this.fieldSize) {
                    continue;
                }
                else {

                    for (let i = 0; i < shipSize; i++) {
                        if (!this.isValidPosition(row + i, col)) {
                            break;
                        }
                    }
                    for (let i = 0; i < shipSize; i++) {
                        this.Area[row + i][col] = "1";
                    }
                }
            }
        }
        
    console.log(this.Area);
    },
    GenerateField: function () {
        this.createField();
        for (let shipSize in this.ShipConf) {
            if (this.ShipConf.hasOwnProperty(shipSize)) {
                for (let i = 0; i < this.ShipConf[shipSize]; i++) {
                    this.placeShipAuto(parseInt(shipSize));
                }
            }
        }
    },
    placeShip: function (shipSize) {

    }


}

function GenerateFieldS() {
    divGameArea.removeChild(buttonGenerate);
    // Вызов функции для создания полей игрока и компьютера
    let Player = new ProtoPlayer("player");
    let Computer = new ProtoPlayer("computer");
    Player.GenerateField();
    
    console.log(Player.Area);
    Computer.GenerateField();


}

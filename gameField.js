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
    this.Area,
        this.ships = []
}

ProtoPlayer.prototype = {
    isValidPosition: function (row, col) {
        console.log("... функция isValidPosition")
        if (row < 0 || col < 0 || row >= this.fieldSize || col >= this.fieldSize) { return false; }
        return true;
    },
    // функция создания поля для прото-игрока
    // Функция создания поля для прото-игрока
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

                FieldBack[i][j] = '0'; // 0 будет говорить о том, что в этой клетке нет корабля
                console.log("i: " + i + " j: " + j)
                // Создание ячеек для прото-игрока
                let cell = document.createElement("td");
                cell.classList.add("cell");
                cell.dataset.rowIndex = `${i}`;
                cell.dataset.columnIndex = `${j}`;
                row.appendChild(cell);
            }
            FieldFront.appendChild(row)
        }

        this.Area = FieldBack; // Присваиваем значения FieldBack переменной Area
        console.log(this.Area);
    },
    //Функция автоматического размещения кора
    placeShipsAutomatically: function () {
        for (let shipType in this.ShipConf) {
            let shipCount = this.ShipConf[shipType];
            console.log("Палуб в коробле " + shipType)
            console.log("Количество, оставшихся для резмещения " + shipCount)
            while (shipCount > 0) {
                let rowIndex = getRandomInt(this.fieldSize);
                let colIndex = getRandomInt(this.fieldSize);
                console.log("rowIndex: " + rowIndex)
                console.log("colIndex: " + colIndex)
                let isVertical = Math.random() < 0.5; // генерация случайного направления корабля
                console.log("вертикально: " + isVertical)
                if (this.isValidShipPlacement(shipType, rowIndex, colIndex, isVertical)) {
                    this.placeShip(Number(shipType), rowIndex, colIndex, isVertical);
                    shipCount--;
                    console.log("-------------------------------")
                }
            }
            console.log(this.Area);
        }
    },
    // Проверка, является ли размещение корабля на поле допустимым
    isValidShipPlacement: function (shipType, rowIndex, colIndex, isVertical) {
        console.log("...isValidShipPlacement")

        for (let i = rowIndex - 1; i <= rowIndex + (shipType) * (isVertical) + 1 * (1 - isVertical); i++) {
            console.log("Проверка строки " + i)

            if (rowIndex <= i & i <= (rowIndex + shipType * (isVertical))) {
                console.log("..., в которой находится корабль")
                for (let j = colIndex; j <= colIndex + shipType * (1 - isVertical); j++) {
                    console.log("... проверка столбца, в которой находится корабль")
                    if (!this.isValidPosition(i, j))
                        return false;
                }
            }
            if (i < 0 || i >= this.fieldSize) {
                continue;
            }
            for (let j = colIndex - 1; j <= colIndex + shipType * (1 - isVertical) + 1 * (isVertical); j++) {
                console.log("... колонки " + j)
                if (j < 0 || j >= this.fieldSize) {
                    continue;
                }
                if (this.Area[i][j] !== '0') {
                    return false;
                }
            }

        }

        return true;
    },
    // Размещение корабля на поле
    placeShip: function (shipType, rowIndex, colIndex, isVertical) {
        console.log("placeShip")
        if (isVertical) {
            for (let i = rowIndex; i < Number(shipType) + rowIndex; i++) {
                console.log("vert " + "i: " + i + " row + shipType : " + (rowIndex + Number(shipType)))
                this.Area[i][colIndex] = String(shipType);
                this.ships.push({ row: i, col: colIndex, type: shipType });

            }
        } else {
            for (let j = colIndex; j < colIndex + Number(shipType); j++) {

                console.log("hor " + "i: " + j + " col+ shipType : " + (colIndex + Number(shipType)))
                this.Area[rowIndex][j] = String(shipType);
                this.ships.push({ row: rowIndex, col: j, type: shipType });
            }
        }
    }
};

// Функция для получения случайного числа в заданном диапазоне
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function GenerateFieldS() {
    divGameArea.removeChild(buttonGenerate);
    // Вызов функции для создания полей игрока и компьютера
    let Player = new ProtoPlayer("player");
    let Computer = new ProtoPlayer("computer");
    Player.createField();
    Computer.createField();
    Player.placeShipsAutomatically();
    Computer.placeShipsAutomatically();

}

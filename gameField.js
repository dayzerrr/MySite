(function () {
    const divMain = document.createElement('div');
    divMain.classList.add('main');
    const body = document.querySelector("body");
    body.appendChild(divMain);

    const header = createHeader();
    divMain.appendChild(header);

    const divGameArea = createGameArea();
    divMain.appendChild(divGameArea);

    const buttonGenerate = createButtonGenerate();
    divGameArea.appendChild(buttonGenerate);

    const form = createForm();
    divMain.appendChild(form);



    function createHeader() {
        const header = document.createElement('h1')
        header.textContent = "Морской Бой";
        return header;
    }

    function createGameArea() {
        const divGameArea = document.createElement('div')
        divGameArea.id = ('gameArea');
        return divGameArea;
    }

    function createButtonGenerate() {
        const buttonGenerate = document.createElement("button");
        buttonGenerate.textContent = "Начать игру";
        buttonGenerate.className = "buttonMenu";
        buttonGenerate.id = "buttonGenerate"
        buttonGenerate.addEventListener("click", startGame);
        return buttonGenerate;
    }

    function createForm() {
        const form = document.createElement("form");
        form.action = "play.html";
        const buttonBack = createButtonBack();
        form.appendChild(buttonBack);
        return form;
    }

    function createButtonBack() {
        const buttonBack = document.createElement("button");
        buttonBack.className = "buttonMenu";
        buttonBack.textContent = "Назад";
        return buttonBack;
    }

    function generateFieldS(pl, com) {
        pl = new ProtoPlayer("player"), com = new ProtoPlayer("computer")
        com.createField();
        pl.createField();
        let butGen = document.getElementById("buttonGenerate")
        butGen.textContent = "Перезапустить игру"

        return { player: pl, computer: com }
    }
    function startGame() { // НАЧАЛО ИГРЫ

        let { player, computer } = generateFieldS()
        Place(player, computer)
        console.log(player)
        console.log(computer)

        let ifEndGame = 1;
        var computerCells = document.querySelectorAll("#computerField .cell");
        var playerCells = document.querySelectorAll("#playerField .cell");
        for (var i = 0; i < computerCells.length; i++) {
            computerCells[i].addEventListener("click", function () {

                handlePlayerMove(this, playerCells, player, computer);

            });

        }

    }
    // Функция для обработки клика игрока на ячейку поля компьютера
    function handlePlayerMove(cell, plCells, player, computer) {
        if (!cell.classList.contains("hit") && !cell.classList.contains("miss")) {
            if (cell.classList.contains("shipComputer")) {
                console.log(computer.ships)
                cell.classList.add("hit");
                return 1; // Разрешение игроку сделать ещё один ход
            } else {
                cell.classList.add("miss");
            }
        }
        // Передача хода компьютеру
        setTimeout(handleComputerMove(plCells), 800);

    }
    function handleComputerMove(plCells) {
        while (true) {
            var randomIndex = Math.floor(Math.random() * plCells.length);
            var cell = plCells[randomIndex];
            if (!cell.classList.contains("hit") && !cell.classList.contains("miss")) {
                if (cell.classList.contains("shipPlayer")) {
                    cell.classList.add("hit");
                    setTimeout(() => {

                    }, 800);
                    continue;

                }
                else {
                    cell.classList.add("miss");
                }
                break;
            }
        }
    }
    function checkShipDestroyed(pl,) {

    }

    function ifEndGame() {

    }

})() // вызов функции



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

        document.getElementById("gameArea").prepend(FieldFront);

        let FieldBack = [];
        let Cells = [];
        for (let i = 0; i < this.fieldSize; i++) {
            const columnLetter = document.createElement("th");
            columnLetter.textContent = this.letters[i];
            FieldHeaderRow.appendChild(columnLetter);

            const row = document.createElement("tr");
            row.innerHTML = `<th>${i + 1}</th>`; // номер строки


            FieldBack.push([]);
            for (let j = 0; j < this.fieldSize; j++) {

                FieldBack[i][j] = '0'; // 0 будет говорить о том, что в этой клетке нет корабля
                // Создание ячеек для прото-игрока
                let cell = document.createElement("td");
                cell.classList.add("cell");
                cell.id = (this.name == "player") * 100 + 10 * i + j;
                //cell.dataset.rowIndex = `${i}`;
                //cell.dataset.columnIndex = `${j}`;
                row.appendChild(cell);
            }
            FieldFront.appendChild(row)
        }

        this.Area = FieldBack; // Присваиваем значения FieldBack переменной Area
        console.log(this.Area);
    },
    //Функция автоматического размещения кораблей
    placeShipsAutomatically: function () {
        for (let shipType in this.ShipConf) {
            let shipCount = this.ShipConf[shipType];
            while (shipCount > 0) {
                let rowIndex = getRandomInt(this.fieldSize);
                let colIndex = getRandomInt(this.fieldSize);
                let isVertical = Math.random() < 0.5; // генерация случайного направления корабля
                if (this.isValidShipPlacement(shipType, rowIndex, colIndex, isVertical)) {
                    this.placeShip(Number(shipType), rowIndex, colIndex, isVertical);
                    shipCount--;
                }
            }
        }
    },
    // Проверка, является ли размещение корабля на поле допустимым
    isValidShipPlacement: function (shipType, rowIndex, colIndex, isVertical) {
        for (let i = rowIndex - 1; i <= rowIndex + (shipType) * (isVertical) + 1 * (1 - isVertical); i++) {
            if (rowIndex <= i & i <= (rowIndex + shipType * (isVertical))) {
                for (let j = colIndex; j <= colIndex + shipType * (1 - isVertical); j++) {
                    if (!this.isValidPosition(i, j))
                        return false;
                }
            }
            if (i < 0 || i >= this.fieldSize) {
                continue;
            }
            for (let j = colIndex - 1; j <= colIndex + shipType * (1 - isVertical) + 1 * (isVertical); j++) {
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
        if (isVertical) {
            for (let i = rowIndex; i < Number(shipType) + rowIndex; i++) {
                this.Area[i][colIndex] = String(shipType);
                this.ships.push({ row: i, col: colIndex, type: shipType });
                if (this.name == "player") {
                    let c = (document.getElementById(100 + i * 10 + colIndex))
                    c.classList.add("shipPlayer");
                }
                else {
                    let c = (document.getElementById(i * 10 + colIndex))
                    c.classList.add("shipComputer");
                }

            }
        } else {
            for (let j = colIndex; j < colIndex + Number(shipType); j++) {
                this.Area[rowIndex][j] = String(shipType);
                this.ships.push({ row: rowIndex, col: j, type: shipType });
                if (this.name == "player") {
                    let c = (document.getElementById(100 + rowIndex * 10 + j))
                    c.classList.add("shipPlayer");
                }
                else {
                    let c = (document.getElementById(rowIndex * 10 + j))
                    c.classList.add("shipComputer");

                }
            }
        }
    }
};

// Функция для получения случайного числа в заданном диапазоне
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}


function Place(p, com) {
    p.placeShipsAutomatically()
    com.placeShipsAutomatically()
}

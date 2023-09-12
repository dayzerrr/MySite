let startgame = false;
let isHadlerPlayer = false;
let isHadlerControler = false;
let yourShop = true;

const getElement = id => document.getElementById(id);
const getCoordinates = el =>{
    const coords = el.getBoundingClientRect();
    return{
        left: coords.f_left + window.pageXOffset,
        right: coords.f_right + window.pageXOffset,
        top: coords.f_top + window.pageYOffset,
        bottom: coords.f_bottom + window.pageYOffset
    };
}

const playerField = getElement("field_player");
const compField = getElement("field_comp");


class Field {
    static Field_side = 330;
    static Ship_side = 33;
    static ship_data = {
        FourDeck: [1, 4],
        TripleDeck: [2, 3],
        DoubleDeck: [3, 2],
        OneDeck: [4, 1]
    }

    constructor(field) {
        this.field = field;
        // 
        this.squadrom = {};
        // игровое поле
        this.matrix = [];
        let { left, right, top, bottom } = getCoordinates(this.field);
        this.f_left = left;
        this.f_right = right;
        this.f_top = top;
        this.f_bottom = bottom;
    }


}



const instruction = getElement('instruction');
const shipsCollection = getElement('ships_collection');
const initialShips = document.querySelector('.wrap + .initial-ships');
const top_text = getElement('text_top');
const buttonPlay = getElement('play');
const buttonNewGame = getElement('new_game');

const humanfield = getElement('')

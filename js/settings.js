window.onload = function () {
    setStandardGoods();
    updateAvailableGoods();

    setSwitcher();

    document.getElementById('add__btn').onclick = function () {
        showForm();
        setAddMode();
    };
};

function setSwitcher() {
    let adminBtn = document.getElementById('admin__btn');
    let clientBtn = document.getElementById('client__btn');

    adminBtn.onclick = function () {
        updateGoodsTable();

        document.getElementById('client__page').style.display = 'none';
        document.getElementById('admin__page').style.display = 'block';
        adminBtn.disabled = true;
        clientBtn.disabled = false;
    };

    clientBtn.onclick = function () {
        updateAvailableGoods();
        clearCart();

        clientBtn.disabled = true;
        adminBtn.disabled = false;
        document.getElementById('admin__page').style.display = 'none';
        document.getElementById('client__page').style.display = 'flex';
    };
}

function setStandardGoods() {
    const STANDART__GOODS__COUNT = 6;
    let codes = [55, 11, 45, 66, 88, 59],
        names = ['Water', 'Bread', 'Car', 'Rocket', 'Wine', 'The Elder Wand'],
        descriptions = [
            'It will help you if you have a hangover',
            'You can buy it on December 31 and the next day make unfunny jokes',
            'Essential for bank robbery',
            'This is used. Elon Musk built a new one for himself',
            'The best Georgian wine',
            'If there is nothing to break and throw away'
        ],
        prices = [10, 40, 10000, 5, 800, 400],
        availables = [true, false, false, true, true, true],
        images = [
            'img/water.jpg',
            'img/bread.jpg',
            'img/car.jpg',
            'img/rocket.jpg',
            'img/wine.jpg',
            'img/wand.jpg',
        ];

    for (let i = 0; i < STANDART__GOODS__COUNT; i++) {
        goods.push(new Good(codes[i], names[i], descriptions[i], prices[i], availables[i], images[i]));
    }
}
let goods = [],
    availableGoods = [],
    addedGoods = [];

window.onload = function () {
    setStandardGoods();
    updateAvailableGoods();

    let adminBtn = document.getElementById('admin__btn');
    let clientBtn = document.getElementById('client__btn');

    adminBtn.onclick = function () {
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

    document.getElementById('add__btn').onclick = function () {
        showForm();
        setAddMode();
    };
};

function checkForm(pos) {
    let errMsg = '';

    let code = document.getElementById('code').value,
        name = document.getElementById('name').value,
        desc = document.getElementById('desc').value,
        price = document.getElementById('price').value;

    if (!code) errMsg += 'Enter the code of good\n';
    if (!name) errMsg += 'Enter the name of good\n';
    if (!desc) errMsg += 'Enter the description of good\n';
    //if(!price) errMsg += 'Enter the price of good\n';
    if (!checkPrice()) errMsg += 'Enter the correct price\n';

    if (!checkCode(code)) errMsg += 'Good with this code already exists\n';
    if (!checkImage()) errMsg += 'Add any picture\n';

    if (errMsg) {
        alert(errMsg);
    } else {
        if (pos || pos === 0) {
            addGood(pos);
            return;
        }
        addGood();
    }

    function checkCode(code) {
        for (let i = 0; i < goods.length; i++) {
            if (goods[i].code === code) return false;
        }

        return true;
    }

    function checkImage() {
        return document.getElementById('img').files.length !== 0;
    }

    function checkPrice() {
        return +price > 0 && isNumeric(+price);
    }

    function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
}

function updateGoodsTable() {
    const THEAD = '<tr>\n' +
        '                <th>Code</th>\n' +
        '                <th>Name</th>\n' +
        '                <th>Description</th>\n' +
        '                <th>Price</th>\n' +
        '                <th>Available</th>\n' +
        '                <th>Image</th>\n' +
        '                <th>Actions</th>\n' +
        '            </tr>';
    let table = document.getElementById('goods__table');

    table.innerHTML = THEAD;

    for (let i = 0; i < goods.length; i++) {
        let newRow = createEl('tr');

        for (let prop in goods[i]) {
            let newCell = createEl('td');

            if (prop === 'actions') {
                let editBtn = createEl("input"),
                    removeBtm = createEl("input");

                editBtn.type = 'button';
                editBtn.value = 'edit';
                editBtn.onclick = function () {
                    editGood(i);
                };

                removeBtm.type = 'button';
                removeBtm.value = 'remove';
                removeBtm.onclick = function () {
                    removeGood(i);
                };

                newCell.appendChild(editBtn);
                newCell.appendChild(removeBtm);

                newRow.appendChild(newCell);

                continue;
            }

            if (prop === 'img') {
                let newPic = createEl('img');

                newPic.width = 70;
                newPic.height = 70;
                newPic.src = goods[i][prop];

                newCell.appendChild(newPic);
                newRow.appendChild(newCell);

                continue;
            }

            newCell.innerHTML = goods[i][prop];
            newRow.appendChild(newCell);
        }
        table.appendChild(newRow);
    }
}

function Good(code, name, des, prc, available, img) {
    this.code = +code;
    this.name = name;
    this.des = des;
    this.price = +prc;
    this.avlbl = available;
    this.img = img;

    this.actions = '';

    return this;
}

function addGood(pos) {
    let file = document.getElementById('img').files[0];
    let reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = function () {
        let code = document.getElementById('code').value,
            name = document.getElementById('name').value,
            desc = document.getElementById('desc').value,
            price = document.getElementById('price').value,
            avlbl = document.getElementById('avlbl').checked,
            img = reader.result;

        if (pos || pos === 0) {
            goods.splice(pos, 1, new Good(code, name, desc, price, avlbl, img));
        } else {
            goods.push(new Good(code, name, desc, price, avlbl, img));
        }
        updateGoodsTable();
        setAddMode();
        hideAddForm();
    };
}

function setStandardGoods() {
    const STANDART__GOODS__COUNT = 6;
    let codes = [55, 11, 45, 66, 88, 59],
        names = ['Water', 'Bread', 'Car', 'Rocket', 'Wine', 'The Elder Wand'],
        description = [
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
        goods.push(new Good(codes[i], names[i], description[i], prices[i], availables[i], images[i]));
    }

    updateGoodsTable();
}

function editGood(pos) {
    let code = document.getElementById('code'),
        name = document.getElementById('name'),
        desc = document.getElementById('desc'),
        avlbl = document.getElementById('avlbl'),
        price = document.getElementById('price');

    showForm();
    setEditMode(pos);

    code.value = goods[pos].code,
        name.value = goods[pos].name,
        desc.value = goods[pos].des,
        avlbl.checked = goods[pos].avlbl,
        price.value = goods[pos].price;
}

function updateAvailableGoods() {
    availableGoods = goods.filter(function (item) {
        return item.avlbl;
    });

    let goodAvailable = document.getElementById('goods__available');
    goodAvailable.innerHTML = '';

    for (let i = 0; i < availableGoods.length; i++) {
        let item = createEl('div', 'item'),
            good__image = createEl('div', 'good__image'),
            good__description = createEl('div', 'good__description'),
            good__name = createEl('div', 'good__name'),
            description__text = createEl('div', 'description__text'),
            good__actions = createEl('div', 'good__actions'),
            good__price = createEl('div', 'good__price'),
            addToListBtn = createEl('input'),
            img = createEl('img');

        //image
        img.src = availableGoods[i].img;
        good__image.appendChild(img);

        //description
        good__name.innerHTML = availableGoods[i].name;
        description__text.innerHTML = availableGoods[i].des;
        good__description.appendChild(good__name);
        good__description.appendChild(description__text);

        //actions
        good__price.innerHTML = '$' + availableGoods[i].price;
        good__actions.appendChild(good__price);
        addToListBtn.type = 'button';
        addToListBtn.value = 'WANT!';
        addToListBtn.onclick = function () {
            addedGoods.push(availableGoods[i]);
            addItemToList();
        };
        good__actions.appendChild(addToListBtn);


        item.appendChild(good__image);
        item.appendChild(good__description);
        item.appendChild(good__actions);

        goodAvailable.appendChild(item);
    }
}

function addItemToList() {
    let total = 0,
        list = '';

    let added = document.getElementById('added__items'),
        totalPrice = document.getElementById('total__price');

    for (let i = 0; i < addedGoods.length; i++) {
        total += addedGoods[i].price;
        list += addedGoods[i].name + '<br/>';
    }

    added.innerHTML = list;
    totalPrice.innerHTML = `$${total}`;
}

function showForm() {
    document.getElementById('admin__form').reset();
    document.getElementById('admin__form__wrapper').style.display = 'block';
}

function hideAddForm() {
    document.getElementById('admin__form').reset();
    document.getElementById('admin__form__wrapper').style.display = 'none';
}

function setEditMode(pos) {
    let btn = document.getElementById('save__form__btn');

    document.getElementById('add__form__btn').disabled = true;
    btn.disabled = false;

    btn.onclick = function () {
        checkForm(pos);
    }
}

function setAddMode() {
    let btn = document.getElementById('add__form__btn');

    document.getElementById('save__form__btn').disabled = true;
    btn.disabled = false;

    btn.onclick = function () {
        checkForm();
    }
}

function removeGood(pos) {
    if (confirm('Are you sure?')) {
        goods.splice(pos, 1);
        updateGoodsTable();
    }
}

function clearCart() {
    let added = document.getElementById('added__items'),
        totalPrice = document.getElementById('total__price');

    added.innerHTML = '';
    totalPrice.innerHTML = '$0';
    addedGoods.length = 0;
}

function createEl(el, cl) {
    let element = document.createElement(el);
    if (el) element.classList.add(cl);
    return element;
}
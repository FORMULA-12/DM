document.addEventListener("DOMContentLoaded", function (event) {
    totalValue();

    if ($('#input_region').val() !== '') $('#input_region').trigger('input');
});

$('#link_denkmit').mouseenter(function () {
    $('#nav_overlay').css('display', 'block');
    $('#dropdown_denkmit').css('display', 'block');
});

$('#link_denkmit').mouseleave(function () {
    $('#nav_overlay').css('display', 'none');
    $('#dropdown_denkmit').css('display', 'none');
});

$('#link_balea').mouseenter(function () {
    $('#nav_overlay').css('display', 'block');
    $('#dropdown_balea').css('display', 'block');
});

$('#link_balea').mouseleave(function () {
    $('#nav_overlay').css('display', 'none');
    $('#dropdown_balea').css('display', 'none');
});

function changeIconSidebar(element) {
    if ($(element).hasClass('fa-chevron-down')) {
        $(element).removeClass('fa-chevron-down');
        $(element).addClass('fa-chevron-up');
    } else {
        $(element).removeClass('fa-chevron-up');
        $(element).addClass('fa-chevron-down');
    }
}

$('#input_region').on('input', function(event) {
    const value = event.target.value;
    if (value === '') {
        $('#select_branch').prop('disabled', true);
        $('#select_branch').empty();
        const option1 = $('<option>', {
            text: 'Виберіть точку видачі',
            value: 'Виберіть точку видачі'
        });
        option1.prop('selected', true);
        $('#select_branch').append(option1);

        $('#select_region').prop('disabled', true);
        $('#select_region').empty();
        const option2 = $('<option>', {
            text: 'Виберіть регіон',
            value: 'Виберіть регіон'
        });
        option2.prop('selected', true);
        $('#select_region').append(option2);
    }
    else {
        $('#select_region').empty();
        $('#select_region').prop('disabled', true);
        $('#spinner_region').prop('hidden', false);
        $.ajax({
            url: '/cart/data?region=' + $('#input_region').val(),
            method: 'GET',
            success: function (response) {
                const selectElement = $('#select_region');
                selectElement.empty();

                response.forEach(function (item) {
                    const option = $('<option>', {
                        value: item,
                        text: item
                    });
                    selectElement.append(option);
                });

                $('#select_region').prop('disabled', false);
                $('#spinner_region').prop('hidden', true);
                $('#select_region').trigger('change');
            },
            error: function (error) {
                console.error(error);
            }
        });
    }
});

$('#select_region').on('change', function () {
    $('#select_branch').empty();
    $('#select_branch').prop('disabled', true);
    $('#spinner_branch').prop('hidden', false);
    $.ajax({
        url: '/cart/data?branch=' + $(this).val() + '&type=' + $('#select_branch_type').val(),
        method: 'GET',
        success: function (response) {
            const selectElement = $('#select_branch');
            selectElement.empty();

            response.forEach(function (item) {
                const option = $('<option>', {
                    value: item,
                    text: item
                });
                selectElement.append(option);
            });

            $('#select_branch').prop('disabled', false);
            $('#spinner_branch').prop('hidden', true);
        },
        error: function (error) {
            console.error(error);
        }
    });
});

$('#select_branch').on('change', function () {
    $('#input_region').val($('#select_region').val());
});

$('#select_branch_type').on('change', function () {
    if ($('#select_branch_type').val() == 'Адресна доставка') {
        $('#form_select_branch').attr('hidden', 'true');
        $('#form_input_branch').removeAttr('hidden');

        $('#select_branch').removeAttr('name');
        $('#input_branch').attr('name', 'address');

        $('#select_branch').removeAttr('required');
        $('#input_branch').attr('required', 'true');

        return;
    } else {
        $('#form_select_branch').removeAttr('hidden');
        $('#form_input_branch').attr('hidden', 'true');

        $('#select_branch').attr('name', 'address');
        $('#input_branch').removeAttr('name');

        $('#select_branch').attr('required', 'true');
        $('#input_branch').removeAttr('required');
    }

    if ($('#select_region').val() == 'Виберіть регіон') {
        return;
    }

    $('#select_branch').empty();
    $('#select_branch').prop('disabled', true);
    $('#spinner_branch').prop('hidden', false);
    $.ajax({
        url: '/cart/data?branch=' + $('#select_region').val() + '&type=' + $('#select_branch_type').val(),
        method: 'GET',
        success: function (response) {
            const selectElement = $('#select_branch');
            selectElement.empty();

            response.forEach(function (item) {
                const option = $('<option>', {
                    value: item,
                    text: item
                });
                selectElement.append(option);
            });

            $('#select_branch').prop('disabled', false);
            $('#spinner_branch').prop('hidden', true);
        },
        error: function (error) {
            console.error(error);
        }
    });
});

function formatNumber(elem) {
    var num = elem.value.replace(/\D/g, '').split(/(?=.)/), i = num.length - 1;
    if (1 > i) num.unshift('38');
    if (0 <= i) num.unshift('+');
    if (1 <= i) num.splice(3, 0, ' (');
    if (4 <= i) num.splice(7, 0, ') ');
    if (7 <= i) num.splice(11, 0, '-');
    if (9 <= i) num.splice(14, 0, '-');
    elem.value = num.join('');
}

// Функция для форматирования числа с разделителями
function formatNumberWithSeparators(num) {
    var numStr = num.toString();
    var formattedNum = [];
    for (var i = 0; i < numStr.length; i++) {
        if (i === 1) formattedNum.push(' (');
        if (i === 4) formattedNum.push(') ');
        if (i === 7) formattedNum.push('-');
        if (i === 9) formattedNum.push('-');
        formattedNum.push(numStr[i]);
    }
    return formattedNum.join('');
}

document.addEventListener('keydown', function (event) {
    var elem = event.target;
    if (elem.id === 'input_phonenumber' && event.key === 'Backspace') {
        var num = elem.value;
        if (num.length > 0) {
            num = (num + '  ').slice(0, -1);
            elem.value = num;
        }
    }
});

// Обработчик события ввода
document.addEventListener('input', function (event) {
    var elem = event.target;
    var inputType = event.inputType;
    if (elem.id === 'input_phonenumber' && inputType === 'deleteContentBackward') {
        var num = elem.value.replace(/\D/g, '');
        if (num.length > 0) {
            num = num.slice(0, -1);
            elem.value = formatNumberWithSeparators(num);
        }
    }
});

function increaseValue(id) {
    var element_count = document.getElementById('cart_count_' + id);
    var element_price = document.getElementById('cart_price_' + id);
    var element_price_hidden = document.getElementById('cart_price_' + id + '_hidden');
    var element_amount_hidden = document.getElementById('cart_amount_' + id + '_hidden');

    var count = parseInt(element_count.innerText);
    var price = parseFloat((element_price_hidden.innerText).replace(',', '.'));
    count++;

    // Обновление содержимого элемента с новым значением
    element_count.innerText = count;
    element_amount_hidden.value = count;
    element_price.innerText = (((price * count).toFixed(2)).toString()).replace('.', ',') + ' €';
    element_price.setAttribute("count", count);

    totalValue();
}

function decreaseValue(id) {
    var element_count = document.getElementById('cart_count_' + id);
    var element_price = document.getElementById('cart_price_' + id);
    var element_price_hidden = document.getElementById('cart_price_' + id + '_hidden');
    var element_amount_hidden = document.getElementById('cart_amount_' + id + '_hidden');

    var count = parseInt(element_count.innerText);
    var price = parseFloat((element_price_hidden.innerText).replace(',', '.'));

    if (count == 1) {
        return
    }

    var count = parseInt(element_count.innerText);
    var price = parseFloat((element_price_hidden.innerText).replace(',', '.'));
    count--;

    // Обновление содержимого элемента с новым значением
    element_count.innerText = count;
    element_price.innerText = (((price * count).toFixed(2)).toString()).replace('.', ',') + ' €';
    element_amount_hidden.value = count;

    totalValue();
}

function totalValue() {
    var elements = document.getElementsByClassName("price-element");

    var sum = 0;

    var cardTotal = document.getElementById("card-total");
    cardTotal.innerHTML = ""; // Очищаем содержимое card-total

    for (var i = 0; i < elements.length; i++) {
        var text = elements[i].innerText.replace(',', '.').slice(0, -2);
        var numbers = text.match(/[\d.]+/g);

        if (numbers !== null) {
            for (var j = 0; j < numbers.length; j++) {
                sum += parseFloat(numbers[j]);
            }
        }

        var label = elements[i].getAttribute('label');
        var count = elements[i].getAttribute('count');

        var row = document.createElement("div");
        row.classList.add("row");
        row.classList.add("px-1");
        if (i !== (elements.length - 1)) {
            row.classList.add("card-total-item");
        } else {
            row.classList.add("card-total-item-last");
        }

        var col1 = document.createElement("div");
        col1.classList.add("col-9");

        var col2 = document.createElement("div");
        col2.classList.add("col-3");

        var labelP = document.createElement("p");
        labelP.classList.add("text-start");
        labelP.textContent = label + " (" + count + " шт.)";

        var priceP = document.createElement("p");
        priceP.classList.add("text-end");
        priceP.innerHTML = Math.ceil(text * 42) + ' ₴<br><span style="color: rgba(82, 82, 96, 0.7);">' + text.replace('.', ',') + ' €</span>';

        col1.appendChild(labelP);
        col2.appendChild(priceP);

        row.appendChild(col1);
        row.appendChild(col2);

        cardTotal.appendChild(row);

        console.log("Label:", label, "Цена:", text);
    }

    $('#price_total').html('<span style="color: rgba(82, 82, 96, 0.7); font-weight: 500;">' + sum.toFixed(2).replace('.', ',') + ' € │</span> ' + Math.ceil(sum * 42) + ' ₴');

    if (sum < 80) {
        document.getElementById('submit_card').classList.add("d-none");
        document.getElementById('submit_card_error').classList.remove("d-none");
    } else {
        document.getElementById('submit_card').classList.remove("d-none");
        document.getElementById('submit_card_error').classList.add("d-none");
    }
}

function validateForm(event) {
    'use strict';

    const form = document.getElementById('form_order');
    const select_branch = document.getElementById('select_branch');

    if (form && !form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
    }

    form.classList.add('was-validated');

    if (select_branch && select_branch.disabled) {
        event.preventDefault();
        event.stopPropagation();
        return;
    }
}

function addReview(grade) {
    $.ajax({
        url: '/account/review/add?grade=' + grade,
        method: 'GET',
        success: function (response) {
            console.log(response.message);

            const toast = new bootstrap.Toast($('#review_toast'), { delay: 2000 });
            toast.show();
        },
        error: function (error) {
            console.error(error);
        }
    });
}




const payment = document.getElementById('payment-method');
const payment_popup = document.getElementById('payment-method-popup');
let icon_active = null;
let user = null;
let totalQuantity = 0;
let totalPrice = 0;

window.onload = function () {
    loadCart();
    updateQuantity();
}

function updateQuantity() {
    if (totalQuantity != 0) {
        if (totalQuantity > 9) totalQuantity = '9+'
        document.getElementById('item-quantity').style.display = 'block';
        document.getElementById('item-quantity').innerText = totalQuantity;
    }
    else
        document.getElementById('item-quantity').style.display = 'none';
}

function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart'));
    const container = document.getElementById('cart-container');
    let s = '';

    if (cart) {
        s = `<tr>
                            <th></th>
                            <th>Tên sản phẩm</th>
                            <th>Đơn giá</th>
                            <th>Số lượng</th>
                            <th>Tổng</th>
                            <th></th>
                        </tr>`;
        cart.forEach(item => {
            let imgsrc, ten, gia;
            for (let i = 0; i < productArray.length; i++) {
                if (item.id == productArray[i].productid) {
                    imgsrc = productArray[i].img;
                    ten = productArray[i].name;
                    gia = productArray[i].price;
                    break;
                }
            }
            gia = gia.toLocaleString('vi-VN');
            s += `<tr class="cart-item">
                            <td style="display: none;">${item.id}</td>
                            <td><img src="${imgsrc}" alt="" style="height: 55px;"></td>
                            <td>
                                ${ten}
                            </td>
                            <td>
                                <span class="item-price">
                                    ${gia}
                                </span>
                                <span> VNĐ</span>
                            </td>
                            <td>
                                <div id="chinhsoluong">
                                    <button style="color: gray;" class="decrease">
                                        -
                                    </button>
                                    <p class="quantity">${item.quantity}</p>
                                    <button class="increase">
                                        +
                                    </button>
                                </div>
                            </td>
                            <td>
                                <p class="item-total">
                                </p>
                            </td>
                            <td>
                                <div class="xoa">
                                    <i class="fa-solid fa-xmark"></i>
                                </div>
                            </td>
                        </tr>`
        });
    }
    container.innerHTML = s;
    updateCart();
    EventListener();
    checkEmptyCart();
}

function checknumber(inp) {
    inp.value = inp.value.replace(/[^0-9]/g, '');

    if (inp.value.trim().length != inp.maxLength) {
        inp.parentElement.classList.add('invalid');
        inp.parentElement.classList.remove('valid');
        inp.focus();
        return false;
    } else {
        inp.parentElement.classList.remove('invalid');
        inp.parentElement.classList.add('valid');
        return true;
    }
}

if (document.getElementById('find_wrap')) document.getElementById('find_wrap').addEventListener('mousedown', function (event) {
    var find = document.getElementById("find");
    var find_wrap = document.getElementById("find_wrap");

    if (!find.contains(event.target)) {
        find.classList.remove('show');
        find_wrap.classList.add('hide');
        setTimeout(() => {
            find_wrap.classList.remove('hide');
            find_wrap.style.display = 'none';
        }, 400);

    }
});

function DinhDangSoThe(inputElement) {
    // Lấy giá trị hiện tại và loại bỏ các ký tự không phải số
    let value = inputElement.value.replace(/[^0-9]/g, '');

    // Chia giá trị thành các nhóm 4 số và nối bằng dấu ' - '
    let formattedValue = value.match(/.{1,4}/g)?.join('-') || '';

    // Gán giá trị định dạng lại vào input
    inputElement.value = formattedValue;

    if (inputElement.value.trim().length != 19) {
        inputElement.parentElement.classList.add('invalid');
        inputElement.parentElement.classList.remove('valid');
        inputElement.focus();
        return false;
    } else {
        inputElement.parentElement.classList.remove('invalid');
        inputElement.parentElement.classList.add('valid');
        return true;
    }
}

function DinhDangNgay(inp) {
    let value = inp.value.replace(/[^0-9]/g, ''); // Loại bỏ ký tự không phải số
    if (value.length > 2) {
        value = value.slice(0, 2) + '/' + value.slice(2); // Thêm dấu '/' sau 2 số đầu
    }
    inp.value = value; // Cập nhật giá trị trong ô input

    // check giá trị ngày
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;

    if (!regex.test(inp.value)) {
        inp.parentElement.classList.add('invalid');
        inp.parentElement.classList.remove('valid');
        inp.focus();
        return false; // Sai định dạng
    }

    const [month, year] = inp.value.split('/');
    const currentYear = new Date().getFullYear() % 100; // Lấy 2 chữ số cuối của năm hiện tại
    const currentMonth = new Date().getMonth() + 1; // Tháng hiện tại (0-11)

    // Kiểm tra nếu năm nhỏ hơn năm hiện tại hoặc năm bằng nhưng tháng nhỏ hơn
    if (year < currentYear || (year == currentYear && month < currentMonth)) {
        inp.parentElement.classList.add('invalid');
        inp.parentElement.classList.remove('valid');
        inp.focus();
        return false; // Ngày tháng đã qua
    }
    inp.parentElement.classList.remove('invalid');
    inp.parentElement.classList.add('valid');
    return true; // Ngày tháng hợp lệ
}

function MoPopUpThanhtoan(icon) {
    if (icon_active) {
        icon_active.classList.remove('active');
    }
    icon_active = icon;
    icon_active.classList.add('active');

    if (icon_active.classList.contains('fa-money-bill-1-wave')) return;

    payment_popup.classList.add('show');
    payment.classList.add('show');
    payment.style.display = 'block';
}

function DongPopUpThanhtoan() {
    document.getElementById('payment-form').reset();
    document.querySelectorAll('.payment-input').forEach(inp => inp.classList.remove('valid'));
    document.querySelectorAll('.payment-input').forEach(inp => inp.classList.remove('invalid'));

    // if (user.sothe == null) {
    //     document.querySelectorAll('.payment-icon').forEach(icon => icon.classList.remove('active'));
    // }
    payment_popup.classList.remove('show');
    payment.classList.remove('show');
    setTimeout(() => {
        payment.style.display = 'none';
    }, 500);
}

// Đóng modal khi nhấn phím ESC
if (payment) payment.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        DongPopUpThanhtoan();
    }
});

document.getElementById('input-information').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        checkEmailkhuyenmai();
    }
})

// Đóng modal khi click bên ngoài nội dung
if (payment) payment.addEventListener('click', function (event) {
    if (!payment_popup.contains(event.target)) {
        DongPopUpThanhtoan();
    }
});

if (document.getElementById('bar_wrap')) document.getElementById('bar_wrap').addEventListener('mousedown', function (event) {
    let bar = document.getElementById("bar");
    let bar_wrap = document.getElementById("bar_wrap");
    if (!bar.contains(event.target)) {
        bar_wrap.classList.add('hide');
        bar.classList.remove('show');
        setTimeout(() => {
            bar_wrap.classList.remove('hide');
            bar_wrap.style.display = 'none';
        }, 400);
    }
});

function checkInput(inp) {
    let val = inp.value;
    if (val.trim() == '') {
        inp.parentElement.classList.add('invalid');
        inp.parentElement.classList.remove('valid');
        inp.focus();
        return false;
    } else {
        inp.parentElement.classList.remove('invalid');
        inp.parentElement.classList.add('valid');
        return true;
    }
}

function checkEmail(inp) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (emailRegex.test(inp.value)) {
        inp.parentElement.classList.remove('invalid');
        inp.parentElement.classList.add('valid');
        return true;
    } else {
        inp.parentElement.classList.add('invalid');
        inp.parentElement.classList.remove('valid');
        inp.focus();
        return false;
    }
}

function checkEmail2(inp) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (emailRegex.test(inp.value)) return true;
    return false;
}

function checkEmailkhuyenmai() {
    // console.log(document.getElementById('email-info').value);
    if (checkEmail2(document.getElementById('email-info'))) {
        displayToast('Đã gửi thông tin khuyến mãi qua Email');
        console.log('true');
        document.getElementById('email-info').value = '';
    } else {
        displayToast('Địa chỉ Email không hợp lệ');
        console.log('false');
    }
}

function checkName(inp) {
    let value = inp.value.replace(/[0-9]/g, ''); // Loại bỏ ký tự không phải số
    inp.value = value;
    if (value.trim() == '') {
        inp.parentElement.classList.add('invalid');
        inp.parentElement.classList.remove('valid');
        inp.focus();
        return false;
    } else {
        inp.parentElement.classList.remove('invalid');
        inp.parentElement.classList.add('valid');
        return true;
    }
}

if (document.getElementById('payment-form')) document.getElementById('payment-form').addEventListener('submit', function (e) {
    e.preventDefault();
    let flag = true;
    flag &= checkName(document.getElementById('firstname'));
    flag &= checkName(document.getElementById('lastname'));
    flag &= checkEmail(document.getElementById('email'));
    flag &= checkInput(document.getElementById('diachi'));
    flag &= DinhDangSoThe(document.getElementById('sothe'));
    flag &= checknumber(document.getElementById('ccv'));
    flag &= DinhDangNgay(document.getElementById('hanthe'));
    flag &= checknumber(document.getElementById('zipcode'));
    // console.log(flag);
    if (flag) {
        icon_active.classList.add('active');
        user.sothe = true;
        DongPopUpThanhtoan();
    }
})

function ThanhToan() {
    if (!icon_active) return displayToast('Bạn phải chọn phương thức thanh toán trước');
    if (totalQuantity == 0) return displayToast('Giỏ hàng của bạn đang trống');
    if (icon_active) {
        LuuHoaDon();
        displayToast('Bạn đã đặt hàng thành công');
    }
}

function TaoMaHD() {
    let hoadon = JSON.parse(localStorage.getItem('hoadon')) || [];

    return 'HD' + hoadon.length;
}

function LuuHoaDon() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    const HoaDon = {
        id: TaoMaHD(), // ID hóa đơn duy nhất
        user: user,
        date: new Date().toLocaleString(), // Ngày tạo hóa đơn
        items: cart,             // Sản phẩm trong giỏ hàng
        total: totalPrice, // Tổng tiền
        payment_method: icon_active,    // Phương thức thanh toán
        trangthai: false    // Trạng thái đơn hàng
    };

    let hoadon = JSON.parse(localStorage.getItem('hoadon')) || [];
    hoadon.push(HoaDon);
    localStorage.setItem('hoadon', JSON.stringify(hoadon));
    localStorage.removeItem('cart'); // Xóa giỏ hàng sau khi lưu
    console.log(cart);

    document.querySelectorAll('.payment-icon').forEach(icon => icon.classList.remove('active'));
    loadCart(); // Cập nhật giao diện giỏ hàng

}

function displayToast(msg) {
    console.log('hihi');
    const toast = document.getElementById('toast');
    toast.style.display = 'block';
    const toastmsg = document.getElementById('toast-msg');
    toastmsg.innerText = msg;
    setTimeout(() => {
        toast.style.display = 'none';
    }, 2900);
}

function EventListener() {
    document.querySelectorAll('.increase').forEach(button => {

        button.addEventListener('click', function () {
            const quantityElement = this.previousElementSibling;
            let currentQuantity = parseInt(quantityElement.textContent);
            quantityElement.textContent = currentQuantity + 1;

            // Cập nhật giỏ hàng nếu cần
            updateCart();
        });
    });


    document.querySelectorAll('.decrease').forEach(button => {
        button.addEventListener('click', function () {
            const quantityElement = this.nextElementSibling;
            let currentQuantity = parseInt(quantityElement.textContent);

            if (currentQuantity > 1) {
                quantityElement.textContent = currentQuantity - 1;

                // Cập nhật giỏ hàng nếu cần
                updateCart();
            }
        });
    });

    document.querySelectorAll('.xoa').forEach(btn => {
        btn.addEventListener('click', function () {
            const parentElement = this.parentElement.parentElement;
            const maSanPham = parentElement.firstElementChild.textContent;

            parentElement.remove();
            removeFromCart(maSanPham);
            updateCart();
        })
    });
}

// Hàm xóa sản phẩm khỏi localStorage
function removeFromCart(id) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== id); // Lọc bỏ sản phẩm có id tương ứng
    localStorage.setItem('cart', JSON.stringify(cart)); // Lưu lại giỏ hàng mới
    // updateCart();
    loadCart();

    checkEmptyCart();
}

function saveCart() {
    const cartItems = document.querySelectorAll('.cart-item');
    let cart = [];

    cartItems.forEach(item => {
        const id = item.firstElementChild.textContent;
        const quantity = item.querySelector('.quantity').textContent;
        cart.push({ id, quantity });
    });

    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCart() {
    const cartItems = document.querySelectorAll('.cart-item');
    totalPrice = 0;
    totalQuantity = 0;

    cartItems.forEach(item => {
        const quantityElement = item.querySelector('.quantity');
        const price = item.querySelector('.item-price').innerText.split('.').join('');
        const quantity = parseInt(quantityElement.textContent);
        const subtotal = price * quantity;

        // Cập nhật tổng tiền cho từng sản phẩm
        // subtotal = subtotal * 1000;
        item.querySelector('.item-total').textContent = subtotal.toLocaleString('vi-VN') + ' VNĐ';

        // Cộng dồn số lượng và giá
        totalPrice += subtotal;
        totalQuantity += quantity;
    });

    // Cập nhật tổng số lượng và tổng giá vào phần tóm tắt giỏ hàng
    if (document.getElementById('total-price'))
        document.getElementById('total-price').textContent = totalPrice.toLocaleString('vi-VN') + ' VNĐ';

    // Lưu lại giỏ hàng
    saveCart();

    // Update số lượng
    updateQuantity();
}

function checkEmptyCart() {
    // console.log(totalQuantity);

    if (totalQuantity == 0) {
        document.getElementById('empty-cart').style.display = 'block';
        document.getElementsByClassName('container')[0].style.display = 'none';
    } else {
        document.getElementById('empty-cart').style.display = 'none';
        document.getElementsByClassName('container')[0].style.display = 'block';
    }
}

function hien(y) {
    var element = document.getElementById(y);
    console.log(element);
    if (element) {
        if (y === 'find_wrap') {
            element.style.display = 'block';
            element.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
            document.getElementById('find').classList.add('show');

        } else if (y === 'bar_wrap') {
            element.style.display = 'block';
            element.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
            document.getElementById('bar').classList.add('show');
        }
    }
}

function exit() {
    var x = document.getElementById("find_wrap");
    document.getElementById('find').classList.remove('show');
    setTimeout(() => {
        x.style.display = "none";
    }, 500);
}

document.addEventListener('keydown', function (event) {

    if (event.key === 'Escape') {
        let find_wrap = document.getElementById('find_wrap');
        let bar_wrap = document.getElementById('bar_wrap');

        if (find_wrap) {
            document.getElementById('find').classList.remove('show');
            find_wrap.classList.add('hide');
            setTimeout(() => {
                find_wrap.style.display = 'none';
                find_wrap.classList.remove('hide');
            }, 400);

        }
        if (bar_wrap) {
            document.getElementById('bar').classList.remove('show');
            bar_wrap.classList.add('hide');
            setTimeout(() => {
                bar_wrap.style.display = 'none';
                bar_wrap.classList.remove('hide');
            }, 400);
        }
    }
});

var productArray = [
    {
        productid: 'D16027-TV0', brandid: 'Asia', img: 'hinhanh/quatdien/fan18-1.jpg', name: 'Quạt đứng Asia D16027-TV0',
        size: 'Ngang 42cm - Cao 93 - 130cm - Sâu 42cm', power: '45W', category: 'quatdung',
        brandOf: 'Việt Nam', madein: 'Việt Nam', year: '2021', price: 1099000
    },

    {
        productid: 'VY538990', brandid: 'Asia', img: 'hinhanh/quatdien/fan21-1.jpg', name: 'Quạt lửng Asia VY538990',
        size: 'Ngang 39cm - Cao 78.2 - 97.2cm - Sâu 39cm', power: '55W', category: 'quatlung',
        brandOf: 'Việt Nam', madein: 'Việt Nam', year: '2022', price: 460000
    },

    {
        productid: 'DH1600', brandid: 'Senko', img: 'hinhanh/quatdien/fan1.jpg', name: 'Quạt đứng Senko DH1600',
        size: 'Ngang 37.5cm - Cao 109 - 123cm - Sâu 41cm', power: '47W', category: 'quatdung',
        brandOf: 'Việt Nam', madein: 'Việt Nam', year: '2019', price: 559000
    },

    {
        productid: 'F-60XDN', brandid: 'Panasonic', img: 'hinhanh/quattran/fan1-1.jpg', name: 'Quạt trần Panasonic F-60XDN',
        size: 'Ngang 150cm - Cao 28.8cm - Sâu 150cm', power: '37W', category: 'quattran',
        brandOf: 'Nhật Bản', madein: 'Malaysia', year: '2019', price: 7390000
    },

    {
        productid: 'F-48DGL', brandid: 'Panasonic', img: 'hinhanh/quattran/fan2-1.jpg', name: 'Quạt trần Panasonic F-48DGL',
        size: 'Ngang 120cm - Cao 27.8cm - Sâu 120cm', power: '31W', category: 'quattran',
        brandOf: 'Nhật Bản', madein: 'Malaysia', year: '2021', price: 1590000
    },

    {
        productid: 'VY628890', brandid: 'Asia ', img: 'hinhanh/quatdien/fan2.jpg', name: 'Quạt lửng Asia VY628890',
        size: 'Ngang 45cm - Cao 80 - 98cm - Sâu 45cm', power: '75W', category: 'quatlung',
        brandOf: 'Việt Nam', madein: 'Việt Nam', year: '2024', price: 510000
    },

    {
        productid: 'VY539790', brandid: 'Asia', img: 'hinhanh/quatdien/fan14-1.jpg', name: 'Quạt đứng Asia VY539790',
        size: 'Ngang 46.5cm - Cao 110 - 139cm - Sâu 46.5cm', power: '55W', category: 'quatdung',
        brandOf: 'Việt Nam', madein: 'Việt Nam', year: '2022', price: 650000
    },

    {
        productid: 'VY619990', brandid: 'Asia', img: 'hinhanh/quatdien/fan15-1.jpg', name: 'Quạt đứng Asia VY619990',
        size: 'Ngang 50cm - Cao 101 - 121cm - Sâu 50cm', power: '55W', category: 'quatdung',
        brandOf: 'Việt Nam', madein: 'Việt Nam', year: '2023', price: 599000
    },

    {
        productid: 'F-56MPG-S', brandid: 'Panasonic', img: 'hinhanh/quattran/fan3-1.jpg', name: 'Quạt trần Panasonic F-56MPG-S',
        size: 'Ngang 140cm - Cao 31.9cm - Sâu 140cm', power: '59W', category: 'quattran',
        brandOf: 'Nhật Bản', madein: 'Malaysia', year: '2022', price: 3180000
    },

    {
        productid: 'VY639990', brandid: 'Asia', img: 'hinhanh/quatdien/fan3.jpg', name: 'Quạt đứng Asia VY639990',
        size: 'Ngang 52cm - Cao 100.5 - 119cm - Sâu 52cm', power: '80W', category: 'quatdung',
        brandOf: 'Việt Nam', madein: 'Việt Nam', year: '2022', price: 790000
    },

    {
        productid: 'TC1622', brandid: 'Senko', img: 'hinhanh/quatdien/fan4.jpg', name: 'Quạt treo tường Senko TC1622',
        size: 'Ngang 45cm - Cao 47cm - Sâu 29cm', power: '65W', category: 'quattreotuong',
        brandOf: 'Việt Nam', madein: 'Việt Nam', year: '2017', price: 540000
    },

    {
        productid: 'VY449690', brandid: 'Asia', img: 'hinhanh/quatdien/fan16-1.jpg', name: 'Quạt đứng Asia VY449690',
        size: 'Ngang 44.5cm - Cao 95 - 130cm - Sâu 44.5cm', power: '55W', category: 'quatdung',
        brandOf: 'Việt Nam', madein: 'Việt Nam', year: '2022', price: 790000
    },

    {
        productid: 'VY358990', brandid: 'Asia', img: 'hinhanh/quatdien/fan23-1.jpg', name: 'Quạt lửng Asia VY358990',
        size: 'Ngang 48.5cm - Cao 72 - 86cm - Sâu 48.5cm', power: '55W', category: 'quatlung',
        brandOf: 'Việt Nam', madein: 'Việt Nam', year: '2022', price: 580000
    },

    {
        productid: 'DR1608', brandid: 'Senko', img: 'hinhanh/quatdien/fan24-1.jpg', name: 'Quạt đứng Senko DR1608',
        size: 'Ngang 39cm - Cao 117 - 129cm - Sâu 39cm', power: '65W', category: 'quatdung',
        brandOf: 'Việt Nam', madein: 'Việt Nam', year: '2018', price: 990000
    },

    {
        productid: 'A16019-XV0', brandid: 'Asia', img: 'hinhanh/quatdien/fan22-1.jpg', name: 'Quạt lửng Asia A16019-XV0',
        size: 'Ngang 36cm - Cao 72 - 92cm - Sâu 36cm', power: '55W', category: 'quatlung',
        brandOf: 'Việt Nam', madein: 'Việt Nam', year: '2019', price: 590000
    },

    {
        productid: 'KG726', brandid: 'Kangaroo', img: 'hinhanh/quatdien/fan31-1.jpg', name: 'Quạt đứng Kangaroo KG726',
        size: 'Ngang 37.6cm - Cao 95 - 126cm - Sâu 38cm', power: '45W', category: 'quatdung',
        brandOf: 'Việt Nam', madein: 'Trung Quốc', year: '2022', price: 1154000
    },

    {
        productid: 'F-80ZBR', brandid: 'Panasonic', img: 'hinhanh/quattran/fan13-1.jpg', name: 'Quạt trần Panasonic F-80ZBR',
        size: 'Ngang 200cm - Cao 40cm - Sâu 200cm', power: '57W ', category: 'quattran',
        brandOf: 'Nhật Bản', madein: 'Malaysia', year: '2019', price: 17390000
    },

    {
        productid: 'D16026-XV0', brandid: 'Asia', img: 'hinhanh/quatdien/fan17-1.jpg', name: 'Quạt đứng Asia D16026-XV0',
        size: 'Ngang 38.5cm - Cao 104 - 119cm - Sâu 39.5cm', power: '56W', category: 'quatdung',
        brandOf: 'Việt Nam', madein: 'Việt Nam', year: '2021', price: 890000
    },

    {
        productid: 'F-60TAN', brandid: 'Panasonic', img: 'hinhanh/quattran/fan4-1.jpg', name: 'Quạt trần Panasonic F-60TAN ',
        size: 'Ngang 150cm - Cao 28.8cm - Sâu 150cm', power: '37W', category: 'quattran',
        brandOf: 'Nhật Bản', madein: 'Malaysia', year: '2016', price: 8500000
    },

    {
        productid: 'TR1628', brandid: 'Senko', img: 'hinhanh/quatdien/fan27-1.jpg', name: 'Quạt treo tường Senko TR1628',
        size: 'Ngang 44.3cm - Cao 63cm - Sâu 36.5cm', power: '47W', category: 'quattreotuong',
        brandOf: 'Việt Nam', madein: 'Việt Nam', year: '2019', price: 550000
    },

    {
        productid: 'KG729', brandid: 'Kangaroo', img: 'hinhanh/quatdien/fan32-1.jpg', name: 'Quạt đứng Kangaroo DC inverter KG729',
        size: 'Ngang 38cm - Cao 114 - 123.5cm - Sâu 38cm', power: '33W', category: 'quatdung',
        brandOf: 'Việt Nam', madein: 'Trung Quốc', year: '2022', price: 3600000
    },

    {
        productid: 'F-60FEN', brandid: 'Panasonic', img: 'hinhanh/quattran/fan12-1.jpg', name: 'Quạt trần Panasonic F-60FEN',
        size: 'Ngang 150cm - Cao 28.8cm - Sâu 150cm', power: '40W', category: 'quattran',
        brandOf: 'Nhật Bản', madein: 'Malaysia', year: '2024', price: 9990000
    },

    {
        productid: 'TC1626', brandid: 'Senko', img: 'hinhanh/quatdien/fan28-1.jpg', name: 'Quạt treo tường Senko TC1626',
        size: 'Ngang 44.5cm - Cao 54.5cm - Sâu 33.5cm', power: '47W', category: 'quattreotuong',
        brandOf: 'Việt Nam', madein: 'Việt Nam', year: '2017', price: 425000
    },

    {
        productid: 'F-60MZ2', brandid: 'Panasonic', img: 'hinhanh/quattran/fan5-1.jpg', name: 'Quạt trần Panasonic F-60MZ2',
        size: 'Ngang 150cm - Cao 45.7cm - Sâu 150cm', power: '66W', category: 'quattran',
        brandOf: 'Nhật Bản', madein: 'Malaysia', year: '2015', price: 1180000
    },

    {
        productid: 'F-56MPG-GO', brandid: 'Panasonic', img: 'hinhanh/quattran/fan6-1.jpg', name: 'Quạt trần Panasonic F-56MPG-GO',
        size: 'Ngang 140cm - Cao 31.9cm - Sâu 140cm', power: '59W', category: 'quattran',
        brandOf: 'Nhật Bản', madein: 'Malaysia', year: '2020', price: 2990000
    },

    {
        productid: 'VY377790', brandid: 'Asia', img: 'hinhanh/quatdien/fan5.jpg', name: 'Quạt treo tường Asia VY377790',
        size: 'Ngang 47cm - Cao 69cm - Sâu 36.5cm', power: '55W', category: 'quattreotuong',
        brandOf: 'Việt Nam', madein: 'Việt Nam', year: '2022', price: 720000
    },

    {
        productid: 'B1612', brandid: 'Senko', img: 'hinhanh/quatdien/fan6.jpg', name: 'Quạt bàn Senko B1612',
        size: 'Ngang 32cm - Cao 65.5cm - Sâu 32cm', power: '47W', category: 'quatban',
        brandOf: 'Việt Nam', madein: 'Việt Nam', year: '2019', price: 425000
    },

    {
        productid: 'KG725', brandid: 'Kangaroo', img: 'hinhanh/quatdien/fan33-1.jpg', name: 'Quạt đứng Kangaroo KG725',
        size: 'Ngang 40cm - Cao 113.5 - 135cm - Sâu 40cm', power: '55W', category: 'quatdung',
        brandOf: 'Việt Nam', madein: 'Trung Quốc', year: '2022', price: 1190000
    },

    {
        productid: 'F-56NCL-S', brandid: 'Panasonic', img: 'hinhanh/quattran/fan11-1.jpg', name: 'Quạt trần Panasonic F-56NCL-S',
        size: 'Ngang 150cm - Cao 30.4cm - Sâu 150cm', power: '70W', category: 'quattran',
        brandOf: 'Nhật Bản', madein: 'Malaysia', year: '2021', price: 2100000
    },

    {
        productid: 'L1638', brandid: 'Senko', img: 'hinhanh/quatdien/fan7.jpg', name: 'Quạt lửng Senko L1638',
        size: 'Ngang 36.8cm - Cao 75.6 - 91.5cm - Sâu 36cm', power: '47W', category: 'quatlung',
        brandOf: 'Việt Nam', madein: 'Việt Nam', year: '2021', price: 470000
    },

    {
        productid: 'DTS1609', brandid: 'Senko', img: 'hinhanh/quatdien/fan25-1.jpg', name: 'Quạt đứng Senko DTS1609',
        size: 'Ngang 46.5cm - Cao 106.3 - 117.5cm - Sâu 46.5cm', power: '60W', category: 'quatdung',
        brandOf: 'Việt Nam', madein: 'Việt Nam', year: '2021', price: 645000
    },

    {
        productid: 'KG723', brandid: 'Kangaroo', img: 'hinhanh/quatdien/fan30-1.jpg', name: 'Quạt treo tường Kangaroo KG723',
        size: 'Ngang 41cm - Cao 53cm - Sâu 30cm', power: '55W', category: 'quattreotuong',
        brandOf: 'Việt Nam', madein: 'Trung Quốc', year: '2022', price: 499000
    },

    {
        productid: 'LTS1632', brandid: 'Senko', img: 'hinhanh/quatdien/fan26-1.jpg', name: 'Quạt lửng Senko LTS1632',
        size: 'Ngang 41.5cm - Cao 86 - 98cm - Sâu 41.5cm', power: '60W', category: 'quatlung',
        brandOf: 'Việt Nam', madein: 'Việt Nam', year: '2021', price: 620000
    },

    {
        productid: 'T1680', brandid: 'Senko', img: 'hinhanh/quatdien/fan29-1.jpg', name: 'Quạt treo tường Senko T1680',
        size: 'Ngang 44.5cm - Cao 59cm - Sâu 33.5cm', power: '47W', category: 'quattreotuong',
        brandOf: 'Việt Nam', madein: 'Việt Nam', year: '2019', price: 349000
    },

    {
        productid: 'LTS1636', brandid: 'Senko', img: 'hinhanh/quatdien/fan8.jpg', name: 'Quạt lửng Senko LTS1636',
        size: 'Ngang 41cm - Cao 85 - 97cm - Sâu 41cm', power: '65W', category: 'quatlung',
        brandOf: 'Việt Nam', madein: 'Việt Nam', year: '2017', price: 560000
    },

    {
        productid: 'VY357690', brandid: 'Asia', img: 'hinhanh/quatdien/fan9.jpg', name: 'Quạt treo tường Asia VY357690',
        size: 'Ngang 44.7cm - Cao 54.5cm - Sâu 33.8cm', power: '55W', category: 'quattreotuong',
        brandOf: 'Việt Nam', madein: 'Việt Nam', year: '2022', price: 550000
    },

    {
        productid: 'KGSF056051', brandid: 'Kangaroo', img: 'hinhanh/quattran/fan7-1.jpg', name: ' Quạt trần Kangaroo KGSF056051',
        size: 'Ngang 140cm - Cao 40.8cm - Sâu 140cm', power: '56W', category: 'quattran',
        brandOf: 'Việt Nam', madein: 'Trung Quốc', year: '2021', price: 2290000
    },

    {
        productid: 'D16018-BV0', brandid: 'Asia', img: 'hinhanh/quatdien/fan19-1.jpg', name: 'Quạt đứng Asia D16018-BV0',
        size: 'Ngang 38.5cm - Cao 96.5 - 109cm - Sâu 41.5cm', power: '45W', category: 'quatdung',
        brandOf: 'Việt Nam', madein: 'Việt Nam', year: '2017', price: 650000
    },

    {
        productid: 'A16009-DV1', brandid: 'Asia', img: 'hinhanh/quatdien/fan20-1.jpg', name: 'Quạt lửng Asia A16009-DV1',
        size: 'Ngang 44cm - Cao 76.5 - 94.5cm - Sâu 44cm', power: '45W', category: 'quatlung',
        brandOf: 'Việt Nam', madein: 'Việt Nam', year: '2018', price: 590000
    },

    {
        productid: 'F-56XPG-W', brandid: 'Panasonic', img: 'hinhanh/quattran/fan8-1.jpg', name: 'Quạt trần Panasonic F-56XPG-W',
        size: 'Ngang 140cm - Cao 29.2cm - Sâu 140cm', power: '59W', category: 'quattran',
        brandOf: 'Nhật Bản', madein: 'Malaysia', year: '2019', price: 3500000
    },

    {
        productid: 'VY355790', brandid: 'Asia', img: 'hinhanh/quatdien/fan10.jpg', name: 'Quạt bàn Asia VY355790',
        size: 'Ngang 29cm - Cao 60cm - Sâu 33cm', power: '55W', category: 'quatban',
        brandOf: 'Việt Nam', madein: 'Việt Nam', year: '2022', price: 550000
    },

    {
        productid: 'B1213', brandid: 'Senko', img: 'hinhanh/quatdien/fan11.jpg', name: 'Quạt bàn Senko B1213',
        size: 'Ngang 26.5cm - Cao 54cm - Sâu 27.5cm', power: '40W', category: 'quatban',
        brandOf: 'Việt Nam', madein: 'Việt Nam', year: '2019', price: 379000
    },

    {
        productid: 'KG748', brandid: 'Kangaroo', img: 'hinhanh/quatdien/fan12.jpg', name: 'Quạt sạc điện Kangaroo KG748',
        size: 'Ngang 36cm - Cao 74 - 88.2cm - Sâu 36cm', power: '24W', category: 'quatsacdien',
        brandOf: 'Việt Nam', madein: 'Trung Quốc', year: '2024', price: 2090000
    },

    {
        productid: 'KG745', brandid: 'Kangaroo', img: 'hinhanh/quatdien/fan13-1.jpg', name: 'Quạt sạc điện Kangaroo KG745',
        size: 'Ngang 24.6cm - Cao 60cm - Sâu 24.6cm', power: '24W', category: 'quatsacdien',
        brandOf: 'Việt Nam', madein: 'Trung Quốc', year: '2024', price: 1250000
    },

    {
        productid: 'KG722DC', brandid: 'Kangaroo', img: 'hinhanh/quattran/fan9-1.jpg', name: 'Quạt trần Kangaroo KG722DC',
        size: 'Ngang 142cm - Cao 42cm - Sâu 142cm', power: '50W', category: 'quattran',
        brandOf: 'Việt Nam', madein: 'Trung Quốc', year: '2022', price: 2990000
    },

    {
        productid: 'F-60WWK-S', brandid: 'Panasonic', img: 'hinhanh/quattran/fan10-1.jpg', name: 'Quạt trần Panasonic F-60WWK-S',
        size: 'Ngang 150cm - Cao 19.6cm - Sâu 150cm', power: '76W', category: 'quattran',
        brandOf: 'Nhật Bản', madein: 'Malaysia', year: '2019', price: 6390000
    },
];
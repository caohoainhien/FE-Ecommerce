const url = "http://localhost:1200/api";

$(async function () {
  await funcCheckLogin();
  funcAllProduct();
  funcGetAllCategoryByProduct();
  ImgUpload();
  funcGetAllBill();
  // funcGetBillById();
  funcAllCustomer();

  $(".btn-login").click(function (e) {
    e.preventDefault();
    $.ajax({
      type: "POST",
      url: `${url}/login`,
      data: JSON.stringify({
        email: $(".txt-email").val(),
        password: $(".txt-password").val(),
      }),
      dataType: "json",
      contentType: "application/json",
      success: function (response) {
        localStorage.setItem("token", response.token);
        window.location.href = "/admin";
      },
    });
  });

  $(".btn-logout").click(function (e) {
    e.preventDefault();
    localStorage.removeItem("token");
    window.location.href = "/admin/login.html";
  });

  $("body").on("click", ".btn-delete-product", function (e) {
    e.preventDefault();

    let productId = $(this).data("id");

    $.ajax({
      type: "DELETE",
      url: `${url}/products/delete_product/${productId}`,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      success: function (response) {
        alert("Xoá sản phẩm thành công!");
        funcAllProduct();
      },

      error: function (error) {
        console.log(error);
        alert(error.responseText);
      },
    });
    console.log(productId);
  });

  $("body").on("click", ".btn-update-product", function (e) {
    e.preventDefault();
    funcHideShowIdProduct("#products__edit");
    funcGetProductById($(this).data("id"));
  });

  $(".btn-show-add-product").click(function (e) {
    e.preventDefault();
    funcHideShowIdProduct("#products__create");
  });
  $(".btn-refresh-add-product").click(async function (e) {
    e.preventDefault();
    location.reload();
    await funcHideShowIdProduct("#products__create");
  });

  $(".breadcramb").click(function (e) {
    e.preventDefault();
    funcHideShowIdProduct("#products__list");
  });

  $(".btn-create-category").click(function (e) {
    e.preventDefault();
    let formData = new FormData();
    formData.append("name", $("#txt-nameCategory").val());

    if ($("#txt-nameCategory").val()) {
      $.ajax({
        type: "POST",
        url: `${url}/categories/add_category`,
        "Content-Type": "multipart/form-data",
        processData: false,
        contentType: false,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        data: formData,
        success: function (response) {
          alert("Thêm thành công!");
          window.location.reload();
        },
        error: function (error) {
          console.log(error);
          alert(error.responseText);
        },
      });
    } else {
      alert("Vui lòng điền những thông tinn cần thiết");
    }
  });

  $("body").on("click", ".btn-delete-category", async function (e) {
    e.preventDefault();
    await $.ajax({
      type: "DELETE",
      url: `${url}/categories/delete_category/${$(this).data("id")}`,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      success: function (response) {
        alert("xoá thành công");
        window.location.reload();
      },
      error: function (error) {
        console.log(error);
        alert(error.responseText);
      },
    });
  });

  $("body").on("click", ".btn-update-category", async function (e) {
    e.preventDefault();

    await $.ajax({
      type: "GET",
      url: `${url}/categories/get_category/${$(this).data("id")}`,
      success: function (response) {
        $("#txt-update-nameCategory").val(response.result[0].categoryName);
        $(".btn-admin-update-category").data("id", response.result[0].categoryId);
      },
    });

    $(".collections__edit").show();
    $(".collections").hide();
    $(".collections-create").hide();
  });

  $(".btn-admin-update-category").click(async function (e) {
    e.preventDefault();
    let formData = new FormData();
    formData.append("name", $("#txt-update-nameCategory").val());
    if ($("#txt-update-nameCategory").val()) {
      await $.ajax({
        type: "PUT",
        url: `${url}/categories/update_category/${$(this).data("id")}`,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        "Content-Type": "multipart/form-data",
        processData: false,
        contentType: false,
        data: formData,
        success: function (response) {
          alert("Cập nhật thành công!");
          window.location.reload();
        },
        error: function (error) {
          console.log(error);
          alert(error.responseText);
        },
      });
    } else {
      alert("Vui lòng điền những thông tinn cần thiết");
    }
  });

  $("#btn-search-product").click(async function (e) {
    e.preventDefault();

    let list_search = await $.get(
      `${url}/products/search_product?product_name=${$("#text-search-product").val()}`
    );
    productInHtml(list_search.result, ".all-products");
  });

  $("#btn-search-category").click(async function (e) {
    e.preventDefault();

    let list_search = await $.get(
      `${url}/categories/search_category?name=${$("#text-search-category").val()}`
    );
    AllCategoryInHTML(list_search, ".list-all-category");
  });

  $(".back-category").click(function (e) {
    e.preventDefault();
    // window.location.href = "/admin/collections.html";
    $(".collections__edit").hide();
    $(".collections").show();
    $(".collections-create").hide();
  });

  $(".btn-show-add-category").click(function (e) {
    e.preventDefault();

    $(".collections__edit").hide();
    $(".collections").hide();
    $(".collections-create").show();
  });

  $(".back-order").click(async function (e) {
    e.preventDefault();
    window.location.reload();
  });

  $(".btn-status-new").click(async function (e) {
    e.preventDefault();
    $(".btn-status-all").removeClass("table--filter--link--active");
    $(".btn-status-succ").removeClass("table--filter--link--active");
    $(".btn-status-new").addClass("table--filter--link--active");

    await $.ajax({
      type: "GET",
      url: `${url}/bills/get_bill_process`,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      success: function (response) {
        $("#all-bill").empty();

        console.log(response);

        response.result.map((val, idx) => {
          $(`
          <div id="table--items" class="table--items" data-id=${val.billId} >
            <a href="#" class="table--items--col1 table--items--transactionId">${val.billId}</a>
            <p class="table--items--col2">${val.purchaseDate}</p>
            <p class="table--items--col3">${val.purchaserName}</p>
            <p class="table--items--col4">${val.purchaserEmail}</p>
            <p class="table--items--col5">${
              val.status && val.status === "NEW" ? "Đang giao hàng" : "Đã giao hàng"
            }</p>
            <p class="table--items--col7">${formatCash(val.price)}đ</p>
          </div>
          `).appendTo("#all-bill");
        });
      },
      error: function (error) {
        console.log(error);
        alert(error.responseText);
      },
    });
  });

  $(".btn-status-succ").click(async function (e) {
    e.preventDefault();
    $(".btn-status-all").removeClass("table--filter--link--active");
    $(".btn-status-new").removeClass("table--filter--link--active");
    $(".btn-status-succ").addClass("table--filter--link--active");

    await $.ajax({
      type: "GET",
      url: `${url}/bills/get_bill_success`,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      success: function (response) {
        $("#all-bill").empty();

        console.log(response);

        response.result.map((val, idx) => {
          $(`
          <div id="table--items" class="table--items" data-id=${val.billId} >
            <a href="#" class="table--items--col1 table--items--transactionId">${val.billId}</a>
            <p class="table--items--col2">${val.purchaseDate}</p>
            <p class="table--items--col3">${val.purchaserName}</p>
            <p class="table--items--col4">${val.purchaserEmail}</p>
            <p class="table--items--col5">${
              val.status && val.status === "NEW" ? "Đang giao hàng" : "Đã giao hàng"
            }</p>
            <p class="table--items--col7">${formatCash(val.price)}đ</p>
          </div>
          `).appendTo("#all-bill");
        });
      },
      error: function (error) {
        console.log(error);
        alert(error.responseText);
      },
    });
  });

  $(".btn-status-all").click(function (e) {
    e.preventDefault();
    $(".btn-status-new").removeClass("table--filter--link--active");
    $(".btn-status-succ").removeClass("table--filter--link--active");
    $(".btn-status-all").addClass("table--filter--link--active");

    funcGetAllBill();
  });

  $("#btn-search-orders").click(async function (e) {
    e.preventDefault();
    await $.ajax({
      type: "GET",
      url: `${url}/bills/search_bill?user_email=${$(".txt-search-orders").val()}`,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      success: function (response) {
        $("#all-bill").empty();

        response.result.map((val, idx) => {
          $(`
          <div id="table--items" class="table--items" data-id=${val.billId} >
            <a href="#" class="table--items--col1 table--items--transactionId">${val.billId}</a>
            <p class="table--items--col2">${val.purchaseDate}</p>
            <p class="table--items--col3">${val.purchaserName}</p>
            <p class="table--items--col4">${val.purchaserEmail}</p>
            <p class="table--items--col5">${
              val.status && val.status === "NEW" ? "Đang giao hàng" : "Đã giao hàng"
            }</p>
            <p class="table--items--col7">${formatCash(val.price)}đ</p>
          </div>
          `).appendTo("#all-bill");
        });
      },
      error: function (error) {
        console.log(error);
        alert(error.responseText);
      },
    });
  });

  $(".btn-date").click(async function (e) {
    e.preventDefault();
    await $.ajax({
      type: "GET",
      url: `${url}/bills/search_bill?order_date_asc="1"&user_email=${$(
        ".txt-search-orders"
      ).val()}`,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      success: function (response) {
        $("#all-bill").empty();

        response.result.map((val, idx) => {
          $(`
          <div id="table--items" class="table--items" data-id=${val.billId} >
            <a href="#" class="table--items--col1 table--items--transactionId">${val.billId}</a>
            <p class="table--items--col2">${val.purchaseDate}</p>
            <p class="table--items--col3">${val.purchaserName}</p>
            <p class="table--items--col4">${val.purchaserEmail}</p>
            <p class="table--items--col5">${
              val.status && val.status === "NEW" ? "Đang giao hàng" : "Đã giao hàng"
            }</p>
            <p class="table--items--col7">${formatCash(val.price)}đ</p>
          </div>
          `).appendTo("#all-bill");
        });
      },
      error: function (error) {
        console.log(error);
        alert(error.responseText);
      },
    });
  });
  $(".btn-price").click(async function (e) {
    e.preventDefault();
    await $.ajax({
      type: "GET",
      url: `${url}/bills/search_bill?order_price_asc="1"&user_email=${$(
        ".txt-search-orders"
      ).val()}`,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      success: function (response) {
        $("#all-bill").empty();

        response.result.map((val, idx) => {
          $(`
          <div id="table--items" class="table--items" data-id=${val.billId} >
            <a href="#" class="table--items--col1 table--items--transactionId">${val.billId}</a>
            <p class="table--items--col2">${val.purchaseDate}</p>
            <p class="table--items--col3">${val.purchaserName}</p>
            <p class="table--items--col4">${val.purchaserEmail}</p>
            <p class="table--items--col5">${
              val.status && val.status === "NEW" ? "Đang giao hàng" : "Đã giao hàng"
            }</p>
            <p class="table--items--col7">${formatCash(val.price)}đ</p>
          </div>
          `).appendTo("#all-bill");
        });
      },
      error: function (error) {
        console.log(error);
        alert(error.responseText);
      },
    });
  });
});

const funcCheckLogin = async () => {
  let token = localStorage.getItem("token");
  if (token) {
    await $.ajax({
      type: "GET",
      url: `${url}/users/get_user`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Bearer " + token,
      },
      success: function (data) {
        if (data.role === "ADMIN") {
        } else {
          localStorage.removeItem("token");

          let href = window.location.href;
          if (href.includes("/admin") && !href.includes("/admin/login.html")) {
            window.location.href = "/admin/login.html";
          }
        }
      },
      error: function (error) {
        localStorage.removeItem("token");

        let href = window.location.href;
        if (href.includes("/admin") && !href.includes("/admin/login.html")) {
          window.location.href = "/admin/login.html";
        }
      },
    });
  } else {
    let href = window.location.href;
    if (href.includes("/admin") && !href.includes("/admin/login.html")) {
      window.location.href = "/admin/login.html";
    }
  }
};

const funcAllProduct = async () => {
  await $.ajax({
    type: "GET",
    url: `${url}/products/get_all_product`,
    // headers: { Authorization: "Bearer " + token },
    success: function (response) {
      $(".all-products").empty();
      $(".all-products-home").empty();

      let allProducts = response.result;
      productInHtml(allProducts, ".all-products");

      allProducts.map((val, idx) => {
        if (idx < 3) {
          $(`

          <div class="table--items">
          <a href="#" class="table--items--col1 table--items--transactionId">
            <img style="width: 50px" class="products__list__item--img" src=${val.images[0].url} alt="3" />
          </a>
          <p class="table--items--col2">${val.productName}</p>
          <p class="table--items--col3">${val.productAmount}</p>
        </div>

        `).appendTo(".all-products-home");
        }
      });
    },
  });
};

function productInHtml(allProducts, el) {
  $(el).empty();
  allProducts.map((val) => {
    $(`
      <div class="table--items products__list__item">
        <div class="products__list__item--imgWrapper">
          <img class="products__list__item--img" src=${val.images[0].url} alt="3" />
        </div>
        <a href="#" class="table--items--col2"> ${val.productName} </a>

        <p class="table--items--col3">${val.productAmount}</p>
        <div>
          <button class="btn-icon btn-icon-success btn-update-product" data-id=${val.productId}>
            <i class="fas fa-pencil-alt"></i>
          </button>
          <button class="btn-icon btn-icon-danger btn-delete-product" data-id=${val.productId}>
            <i class="far fa-trash-alt"></i>
          </button>
        </div>
      </div>
    </div>

    `).appendTo(el);
  });
}

const funcGetProductById = async (id) => {
  await $.ajax({
    type: "GET",
    url: `${url}/products/get_product/${id}`,
    success: async function (response) {
      let { productId, productName, productDes, productAmount, productPrice, images, categories } =
        response.result[0];
      let categoriesId = categories.map((val) => val.categoryId);
      $(".txt-edit-product-name").val(productName);
      $(".txt-edit-product-desc").val(productDes);
      $(".txt-edit-product-price").val(productPrice);
      $(".txt-edit-product-amount").val(productAmount);
      $(".btn-admin-update-product").data("id", id);

      funcGetImages(images);

      await $.get(`${url}/categories/get_all_category`, function (data) {
        $(".all-category-admin-02").empty();
        data.result.map((val) => {
          $(`
            <label class="checkbox-container"
              >${val.categoryName}
              <input ${
                categoriesId.includes(val.categoryId) ? "checked" : ""
              } type="checkbox"  name="category" value=${val.categoryId} />
              <span class="checkmark"></span>
            </label>
          `).appendTo(".all-category-admin-02");
        });
      });

      $("body").on("click", ".upload__img-close-02", function (e) {
        e.preventDefault();
        let filterId = $(this).data("id");
        images = images.filter((val) => val.imageId !== filterId);
        funcGetImages(images);
      });
    },
  });
};

const funcGetImages = (images) => {
  $(".list-img-edit").empty();
  images.map((val) => {
    $(
      `
      <div class='upload__img-box'>
        <div style='background-image: url("${val.url}")' class='img-bg'>
          <div class='upload__img-close upload__img-close-02' data-id=${val.imageId}>
          </div>
         </div>
      </div>
      `
    ).appendTo(".list-img-edit");
  });
};

function ImgUpload() {
  var imgWrap = "";
  var imgArray = [];

  $(".upload__inputfile").each(function () {
    $(this).on("change", function (e) {
      imgWrap = $(this).closest(".upload__box").find(".upload__img-wrap");
      var maxLength = $(this).attr("data-max_length");

      var files = e.target.files;
      var filesArr = Array.prototype.slice.call(files);
      var iterator = 0;
      filesArr.forEach(function (f, index) {
        if (!f.type.match("image.*")) {
          return;
        }

        if (imgArray.length > maxLength) {
          return false;
        } else {
          var len = 0;
          for (var i = 0; i < imgArray.length; i++) {
            if (imgArray[i] !== undefined) {
              len++;
            }
          }
          if (len > maxLength) {
            return false;
          } else {
            imgArray.push(f);

            var reader = new FileReader();
            reader.onload = function (e) {
              var html =
                "<div class='upload__img-box'><div style='background-image: url(" +
                e.target.result +
                ")' data-number='" +
                $(".upload__img-close").length +
                "' data-file='" +
                f.name +
                "' class='img-bg'><div class='upload__img-close upload__img-close-01'></div></div></div>";
              imgWrap.append(html);
              iterator++;
            };
            reader.readAsDataURL(f);
          }
        }
      });
    });
  });

  $("body").on("click", ".upload__img-close-01", function (e) {
    var file = $(this).parent().data("file");
    for (var i = 0; i < imgArray.length; i++) {
      if (imgArray[i].name === file) {
        imgArray.splice(i, 1);
        break;
      }
    }

    $(this).parent().parent().remove();
  });

  $(".btn-admin-add-product").click(async function (e) {
    e.preventDefault();
    let nameProduct = $(".txt-product-name").val();
    let descProduct = $(".txt-product-desc").val();
    let priceProduct = $(".txt-product-price").val();
    let amountProduct = $(".txt-product-amount").val();
    let productType = $("input[name='category']:checked")
      .map(function () {
        return Number(this.value);
      })
      .get();

    if (
      !nameProduct ||
      !descProduct ||
      !priceProduct ||
      !amountProduct ||
      !productType ||
      !imgArray
    ) {
      alert("Vui lòng nhập đầy đủ thông tin");
    } else {
      let formData = new FormData();
      formData.append("name", nameProduct);
      formData.append("des", descProduct);
      formData.append("price", Number(priceProduct));
      formData.append("categoryId", productType);
      imgArray.map((item) => formData.append("imageFiles", item));
      formData.append("amount", Number(amountProduct));

      await $.ajax({
        type: "POST",
        url: `${url}/products/add_product`,
        data: formData,
        "Content-Type": "multipart/form-data",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        processData: false,
        contentType: false,
        success: function (response) {
          if (response) {
            alert("Tạo sản phẩm thành công");
          }
          window.location.reload();
        },
        error: function (error) {
          console.log(error);
          alert(error.responseText);
        },
      });
    }
  });
  $(".btn-admin-update-product").click(async function (e) {
    e.preventDefault();
    let idUpdate = $(this).data("id");
    let nameProduct = $(".txt-edit-product-name").val();
    let descProduct = $(".txt-edit-product-desc").val();
    let priceProduct = $(".txt-edit-product-price").val();
    let amountProduct = $(".txt-edit-product-amount").val();
    let productType = $("input[name='category']:checked")
      .map(function () {
        return Number(this.value);
      })
      .get();

    let imageId = [];
    let idArr = document.querySelectorAll(".upload__img-close-02");
    if (idArr.length > 0) {
      for (let i = 0; i < idArr.length; i++) {
        imageId.push(idArr[i].dataset.id);
      }
    }

    if (
      !nameProduct ||
      !descProduct ||
      !priceProduct ||
      !amountProduct ||
      !productType ||
      !imgArray
    ) {
      alert("Vui lòng nhập đầy đủ thông tin");
    } else {
      let formData = new FormData();
      formData.append("name", nameProduct);
      formData.append("des", descProduct);
      formData.append("price", Number(priceProduct));
      formData.append("categoryId", productType);
      imgArray.map((item) => formData.append("imageFiles", item));
      formData.append("amount", Number(amountProduct));
      formData.append("imageId", imageId);

      await $.ajax({
        type: "PUT",
        url: `${url}/products/update_product/${idUpdate}`,
        data: formData,
        "Content-Type": "multipart/form-data",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        processData: false,
        contentType: false,
        success: function (response) {
          if (response) {
            alert("Sửa sản phẩm thành công");
          }

          window.location.reload();
        },
        error: function (error) {
          console.log(error);
          alert(error.responseText);
        },
      });
    }
  });
}
const funcGetAllCategoryByProduct = async () => {
  $(".all-category-admin").empty();
  $(".list-all-category").empty();
  await $.get(`${url}/categories/get_all_category`, function (data) {
    data.result.map((val) => {
      $(`
          <label class="checkbox-container"
            >${val.categoryName}
            <input type="checkbox"  name="category" value=${val.categoryId} />
            <span class="checkmark"></span>
          </label>
       `).appendTo(".all-category-admin");

      $(`
        <div class="table--items collections__items">
          <div class="collections__items--imgWrapper">
            ${val.categoryId}
          </div>
          <p class="table--items--col2">${val.categoryName}</p>
          <div>
            <button class="btn-icon btn-icon-success btn-update-category" data-id="${val.categoryId}">
              <i class="fas fa-pencil-alt"></i>
            </button>
            <button class="btn-icon btn-icon-danger btn-delete-category" data-id="${val.categoryId}">
              <i class="far fa-trash-alt"></i>
            </button>
          </div>
        </div>
       `).appendTo(".list-all-category");
    });
  });
};

function AllCategoryInHTML(data, el) {
  $(el).empty();
  data.result.map((val) => {
    $(`
      <div class="table--items collections__items">
        <div class="collections__items--imgWrapper">
          ${val.categoryId}
        </div>
        <p class="table--items--col2">${val.categoryName}</p>
        <div>
          <button class="btn-icon btn-icon-success btn-update-category" data-id="${val.categoryId}">
            <i class="fas fa-pencil-alt"></i>
          </button>
          <button class="btn-icon btn-icon-danger btn-delete-category" data-id="${val.categoryId}">
            <i class="far fa-trash-alt"></i>
          </button>
        </div>
      </div>
     `).appendTo(el);
  });
}

const funcHideShowIdProduct = (idShow) => {
  const allId = ["#products__list", "#products__create", "#products__edit"];

  allId.map((val) => {
    if (val == idShow) {
      $(idShow).show();
    } else {
      $(val).hide();
    }
  });
};

const funcGetAllBill = async () => {
  await $.ajax({
    type: "GET",
    url: `${url}/bills/get_all_bill`,
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    success: function (response) {
      $("#all-bill").empty();
      $("#all-bill-home").empty();
      $(".order-count").text(response.result.length);

      let totalPrice;

      if (response.result.length > 0)
        totalPrice = response.result.reduce((total, item) => total + item.price, 0);

      $(".total-price").text(`${formatCash(totalPrice)}đ`);

      response.result.map((val, idx) => {
        $(`
        <div id="table--items" class="table--items" data-id=${val.billId} >
          <a href="#" class="table--items--col1 table--items--transactionId">${val.billId}</a>
          <p class="table--items--col2">${val.purchaseDate}</p>
          <p class="table--items--col3">${val.purchaserName}</p>
          <p class="table--items--col4">${val.purchaserEmail}</p>
          <p class="table--items--col5">${
            val.status && val.status === "NEW" ? "Đang giao hàng" : "Đã giao hàng"
          }</p>
          <p class="table--items--col7">${formatCash(val.price)}đ</p>
        </div>
        `).appendTo("#all-bill");

        if (idx < 3) {
          $(`
        <div class="table--items">
          <a href="#" class="table--items--col1 table--items--transactionId">${val.billId}</a>
          <p class="table--items--col2">${val.purchaseDate}</p>
          <p class="table--items--col3">${val.purchaserName}</p>
          <p class="table--items--col4">${val.purchaserEmail}</p>
          <p class="table--items--col5">${
            val.status && val.status === "NEW" ? "Đang giao hàng" : "Đã giao hàng"
          }</p>
          <p class="table--items--col7">${formatCash(val.price)}đ</p>
        </div>
        `).appendTo("#all-bill-home");
        }
      });
    },
    error: function (error) {
      console.log(error);
      // alert(error.responseText);
    },
  });

  $("body").on("click", "#table--items", function (e) {
    e.preventDefault();
    $(".singleOrder").show();
    $(".orders").hide();

    funcGetBillById($(this).data("id"));
  });
};

const funcGetBillById = (id) => {
  $.ajax({
    type: "GET",
    url: `${url}/bills/get_bill/${id}`,
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    success: function (response) {
      console.log(response);
      $(".id-order").text(`#${response.result[0].id}`);
      $(".date-order").text(`${response.result[0].purchaseDate}`);
      $(".customer-name").text(`${response.result[0].userResponse.fullName}`);
      $(".customer-phone").text(`${response.result[0].userResponse.phone}`);
      $(".customer-email").text(`${response.result[0].userResponse.email}`);
      $(".customer-address").text(`${response.result[0].userResponse.address}`);
      $(".singleOrder-total").text(`${formatCash(response.result[0].totalPrice)}đ`);
      $(".priceShip").text(`${formatCash(response.result[0].feeShip)}đ`);
      $(".priceTotal").text(
        `${formatCash(Number(response.result[0].feeShip) + Number(response.result[0].totalPrice))}đ`
      );

      $(".status-bill").empty();

      $(".status-bill").text(
        response.result[0].status === "NEW" ? "Đang giao hàng" : "Đã giao hàng"
      );

      if (response.result[0].status === "NEW") {
        if (!$(".btn-update-status-bill").hasClass("btn-danger")) {
          $(".btn-update-status-bill").addClass("btn-danger");
        }
      } else {
        $(".btn-update-status-bill").removeClass("btn-danger");
      }

      $(".singleOrder-list-product").empty();
      response.result[0].productResponse.map((val) => {
        $(`
        <li class="singleOrder__main--card--item">
        <div class="singleOrder__main--card--item--imgWrapper">
          <img
            class="singleOrder__main--card--item--img"
            src="${val.product.images[0].url}"
            alt="1"
          />

          <span class="singleOrder__main--card--item--countWrapper"> ${val.amountPurchased} </span>
        </div>

        <div
          class="singleOrder__main--card--item--details dflex justify-content-between"
        >
          <p class="singleOrder__main--card--item--title">${val.product.productName}</p>

          <p class="singleOrder__main--card--item--price">${formatCash(
            val.product.productPrice
          )}đ</p>
          <p class="singleOrder__main--card--item--qty">
            <span class="mr-1">x</span>
            ${val.amountPurchased}
          </p>
          <p class="singleOrder__main--card--item--total">${formatCash(
            val.product.productPrice * val.amountPurchased
          )}đ</p>
        </div>
      </li>
        `).appendTo(".singleOrder-list-product");
      });
    },
  });

  $(".btn-update-status-bill").click(function (e) {
    e.preventDefault();
    if ($(".btn-update-status-bill").hasClass("btn-danger")) {
      $.ajax({
        type: "PUT",
        url: `${url}/bills/update_bill_status/${id}`,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        success: function (response) {
          alert("Đơn hàng này đã giao thành công");

          window.location.reload();
        },
      });
    } else {
      alert("Đơn hàng này đã giao");
    }
  });
};

const funcAllCustomer = () => {
  $.ajax({
    type: "GET",
    url: `${url}/users/get_all_user`,
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    success: function (response) {
      $(".customers-item").empty();

      $(".count-customer").text(response.result.length);

      response.result.map((item) => {
        $(`
          <div class="table--items customers__items">
            <div class="">
              <h3>${item.fullName}</h3>
              <p>${item.address}</p>
            </div>
            <p class="table--items--col2">${item.phone}</p>
            <p class="table--items--col3">${item.email}</p>
            <p class="table--items--col4">${item.purchaseInvoice}</p>
          </div>
        `).appendTo(".customers-item");
      });
    },
  });
};

const formatCash = (str) => {
  return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const url = "http://localhost:1200/api";

// format price
const formatCash = (str) => {
  return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

$(async function () {
  // show category
  let list_category = await $.get(`${url}/categories/get_all_category`);
  funcShowCategoryOption(list_category, "#select-category");
  let list_search_products = JSON.parse(localStorage.getItem("list_search")) || [];
  funcShowCategory(list_category, ".list-category");
  funcShowCategory02(list_category, ".list-category-02");

  if (list_search_products.result && list_search_products.result?.length > 0) {
    renderAllProducts02(list_search_products, ".list-product-search");
  } else {
    $(".list-product-search").empty();
    $(`
      <div class="result-wrapper u-s-p-y-80" style="width: 100%">
        <h4>Tìm kiếm của bạn không phù hợp với bất kỳ sản phẩm.</h4>

        <h1>SORRY</h1>
      </div>
    `).appendTo(".list-product-search");
  }

  $("body").on("click", ".item-category", async function (e) {
    e.preventDefault();
    let id_category = $(this).data("id");

    let get_category = await $.get(`${url}/categories/get_category/${id_category}`);
    get_category = get_category.result[0];

    console.log(get_category);

    localStorage.setItem("get_category", JSON.stringify(get_category));
    funcSetNameCategory();

    window.location.href = "shop-category.html";
  });

  $("body").on("click", ".detail-custom-page", async function (e) {
    let id_custom_detail = $(this).data("id");

    localStorage.setItem("id_custom_detail", id_custom_detail);
    funcSetNameCategory02();
  });

  $(".submit-search").click(async function (e) {
    e.preventDefault();

    let name_search = $("#search-landscape").val();
    let id_category = $("#select-category").val();

    if (name_search) {
      if (id_category) {
        let list_search = await $.get(
          `${url}/products/search_product?product_name=${name_search}&category_id=${id_category}`
        );

        localStorage.setItem("list_search", JSON.stringify(list_search));

        if (!window.location.href.includes("search.html")) window.location.href = "search.html";
      } else {
        let list_search = await $.get(`${url}/products/search_product?product_name=${name_search}`);

        localStorage.setItem("list_search", JSON.stringify(list_search));

        if (!window.location.href.includes("search.html")) window.location.href = "search.html";
      }
    }
  });

  // Initialize NProgress
  NProgress.configure({ showSpinner: false });
  // Bind Scroll Up plugin to all pages
  $.scrollUp({
    scrollName: "topScroll",
    scrollText: '<i class="fas fa-long-arrow-alt-up"></i>',
    easingType: "linear",
    scrollSpeed: 900,
    animation: "fade",
    zIndex: 100,
  });

  // Bind this plugin on Product `Detail` page
  $("#zoom-pro").elevateZoom({
    gallery: "gallery",
    galleryActiveClass: "active",
    borderSize: 1,
    zoomWindowWidth: 540,
    zoomWindowHeight: 540,
    zoomWindowOffetx: 10,
    borderColour: "#e9e9e9",
  });

  // For `modals` we don't want to enable `zoom window`.
  $("#zoom-pro-quick-view").elevateZoom({
    gallery: "gallery-quick-view",
    galleryActiveClass: "active",
    zoomEnabled: false, // false disables zoomwindow from showing
  });

  // Bind resize select on mid header
  $("#select-category", document).ResizeSelect();
  $(".select-hide").removeClass("select-hide");

  // Bind mega menu plugin
  $(".v-menu", document).MegaMenuDropDowns();

  // Bind Countdown Timer to all sections
  $(".section-timing-wrapper.dynamic", document).CountDown();
  funcSetNameCategory();
  funcSetNameCategory02();
});
/*============================================================================*/
/* Global JavaScript functions
/*============================================================================*/
(function ($, window, document) {
  "use strict";
  // ------------- Variables for Reusability and Performance ---------------
  // Performance of jQuery selectors vs local variables
  // https://jsperf.com/caching-jquery-selectors
  let $vMenu = $(".v-menu");
  let mode = "";
  let bigScreenFlag = Number.MAX_VALUE;
  let smallScreenFlag = 1;
  // ------------------------Back Drop Arena ---------------------------
  let listItembackDropFlag = false;
  let $backDrop;
  let $searchFormWrapper;
  let $searchFormElement;
  let $allListItemsForHover = $(".js-backdrop");
  // ------------------------Back Drop Arena End ---------------------------
  // Object Settings
  let settings = {
    bodyBackDropOnScenes: true,
    zIndexNumber: 999998,
  };

  /**
   * return the window's width
   * @return {Number|number}
   */
  const windowWidth = function () {
    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  };

  /**
   * @param {jquery} element  - display back drop
   */
  const showBackDrop = function (element) {
    element.css("display", "block").on("click", function () {
      $(this).css("display", "");
    });
  };

  /**
   * @param {jquery} element  - remove back drop
   */
  const removeBackDrop = function (element) {
    element.css("display", "");
  };

  /**
   * Attach Click Event on Search Button
   */
  const attachClickOnResponsiveSearchForm = function () {
    $("#responsive-search").on("click", function () {
      $(".responsive-search-wrapper").stop(true, true).fadeIn();
    });

    $("#responsive-search-close-button").on("click", function () {
      $(".responsive-search-wrapper").stop(true, true).fadeOut();
    });
  };

  /**
   * Attach Click Event on Mini Cart Anchor
   */
  const attachClickOnMiniCart = function () {
    //  let $href = $('#mini-cart-trigger'.attr('href');
    //   window.location.href = $href; //causes the browser to refresh and
    // load the requested url
    $("#mini-cart-trigger").on("click", function () {
      $(".mini-cart-wrapper").addClass("mini-cart-open");
    });

    $("#mini-cart-close").on("click", function () {
      $(".mini-cart-wrapper").removeClass("mini-cart-open");
    });
  };

  /**
   * Attach Click Event on VMenu
   */
  const attachClickOnVMenu = function () {
    $(".v-title").on("click", function () {
      $vMenu.toggleClass("v-close");
    });
  };

  /**
   * Its a function that is bind to Mega Menu List items with event mouseenter
   */
  const MouseEnterFunctionForMegaMenu = function () {
    // I also Hope elements are appropriate assign
    $vMenu.css({ "z-index": settings.zIndexNumber });
    // Show Back Drop
    showBackDrop($backDrop);
  };
  /**
   * Its a function that is bind to Mega Menu List items with event mouseleave
   */
  const MouseLeaveFunctionForMegaMenu = function () {
    // I also Hope elements are appropriate assign
    $vMenu.css({ "z-index": "" });
    // Remove Back Drop
    removeBackDrop($backDrop);
  };

  /**
   * Hover on list items that have class `js-backdrop`
   */
  const hoverOnListItems = function () {
    $allListItemsForHover.on("mouseenter", MouseEnterFunctionForMegaMenu);
    $allListItemsForHover.on("mouseleave", MouseLeaveFunctionForMegaMenu);
  };
  /**
   * Hoveroff on list items that have class `js-backdrop`
   */
  const hoverOffListItems = function () {
    $allListItemsForHover.off("mouseenter");
    $allListItemsForHover.off("mouseleave");
  };

  /**
   * Backdrop only works on landscape mode this function will Check
   * if user wants to show or hide the backdrop
   */
  const mainBackDropManipulator = function () {
    if (settings.bodyBackDropOnScenes) {
      if (mode === "landscape" && !listItembackDropFlag) {
        // If body has length equal to zero then it means our element is
        // not added, if it did'nt have length equal to zero then it
        // means our element is added.
        if ($("#app").find(".body-backdrop").length === 0) {
          $("#app").append('<div class="body-backdrop"></div>\n');
          // Assign Back Drop
          $backDrop = $("div.body-backdrop");
          // Input type Text
          $searchFormElement = $("#search-landscape");
          $searchFormWrapper = $(".form-searchbox");
          $searchFormElement
            .focus(function () {
              // I Hope elements are appropriate assign
              $searchFormWrapper.css({ position: "relative", "z-index": settings.zIndexNumber });
              // Show Back Drop
              showBackDrop($backDrop);
            })
            .blur(function () {
              // I Hope elements are appropriate assign
              $searchFormWrapper.css({ position: "", "z-index": "" });
              // Remove Back Drop
              removeBackDrop($backDrop);
            });
          // First Time invocation
          // HoverOn list items that have class `js-backdrop`
          hoverOnListItems();
          // Flag is set to true
          listItembackDropFlag = true;
        }
      }

      if (mode === "landscape" && listItembackDropFlag) {
        // It means hover is On
        hoverOnListItems();
      } else if (mode === "portrait" && listItembackDropFlag) {
        // Hover is Off
        hoverOffListItems();
      }
    }
  };
  /**
   * Manually Restart Pace-js when we change any tab.
   */
  const manuallyRestartProgress = function () {
    // Specificity = 2
    $('a[data-toggle="tab"]').on("shown.bs.tab", function () {
      // Shows the progress bar
      NProgress.start();
      // Completes the progress
      NProgress.done();
    });
  };
  /**
   * Attach Click Event on Quantity buttons
   */
  const attachClickQuantityButton = function () {
    let $currentTextField, currentVal;
    $(".plus-a").each(function () {
      $(this).on("click", function () {
        let $currentTextField = $(this).prev();
        let currentVal = parseInt($currentTextField.val());
        /*
         * Format values
         * In JS if variable is not converted to number then by default variable is NaN.
         * We known JS has Truthy & Falsey values.
         * By default NaN (e.g. the result of 1/0) is false so its convert to true and expression
         * becomes true.
         */
        if (!currentVal || currentVal === "" || currentVal === "NaN" || currentVal === 0) {
          // if value is NaN
          $currentTextField.val(1);
        }
        // Compare and add 1 if the condition is satisfy
        else if (currentVal < $(this).data("max")) {
          $currentTextField.val(currentVal + 1);
        }
      });
    });
    $(".minus-a").each(function () {
      $(this).on("click", function () {
        $currentTextField = $(this).closest("div").find("input");
        currentVal = parseInt($currentTextField.val());
        /*
         * Format values
         * In JS if variable is not convert to number then by default variable is NaN.
         * We known JS has Truthy & Falsey values.
         * By default NaN (e.g. the result of 1/0) is false so its convert to true and expression
         * becomes true.
         */
        if (!currentVal || currentVal === "" || currentVal === "NaN" || currentVal === 0) {
          // if value is NaN
          $currentTextField.val(1);
        }
        // Compare and minus 1 if the condition is satisfy
        else if (currentVal > $(this).data("min")) {
          $currentTextField.val(currentVal - 1);
        }
      });
    });
  };

  /**
   * Window Resize Breakpoint Function
   */
  const windowResizeBreakpoint = function () {
    if (windowWidth() <= 991 && bigScreenFlag > 991) {
      // Assign on which mode we are
      mode = "portrait";
      // Backdrop Manipulator on PORTRAIT
      mainBackDropManipulator();
    }

    if (windowWidth() > 991 && smallScreenFlag <= 991) {
      // Assign on which mode we are
      mode = "landscape";
      // Backdrop Manipulator on LANDSCAPE
      mainBackDropManipulator();
    }
    bigScreenFlag = windowWidth();
    smallScreenFlag = windowWidth();
  };

  /**
   * Resize event
   */
  $(window).resize(function () {
    // Window Resize Breakpoint Function
    windowResizeBreakpoint();
  });

  /**
   * Only One Time Execution Ready event Check DOM elements if all loaded
   */
  $(function () {
    //  Attach Click Event on Search Button
    attachClickOnResponsiveSearchForm();
    //  Attach Click Event on Mini Cart Anchor
    attachClickOnMiniCart();
    // Attach Click Event on VMenu
    attachClickOnVMenu();
    // Manually Restart Pace-js when we change any tab
    manuallyRestartProgress();
    // Attach Click Event on Quantity buttons
    // attachClickQuantityButton();
    // Window Resize Breakpoint Function
    windowResizeBreakpoint();
  });
})(jQuery, window, document);

/*============================================================================*/
/* Homepage JavaScript functions
/*============================================================================*/
(function ($, window, document) {
  "use strict";

  // take data localStorage
  const products_inCart_new = localStorage.getItem("products_inCart") || [];
  const products_inView = products_inCart_new.length ? JSON.parse(products_inCart_new) : [];
  let products_inCart = [...products_inView];

  // render all component cart
  const render_all_cart = () => {
    renderItemCounter();
    renderMiniCart();
  };

  // total price
  const totalPrice = () => products_inCart.reduce((acc, val) => acc + val.total, 0);

  // render item counter
  const renderItemCounter = () => {
    if (products_inCart.length === 0) {
      $(".item-counter").hide();
      $(".item-price").hide();
      $(".mini-shop-total").hide();
      $(".mini-action-anchors").hide();
    } else {
      $(".item-counter").text(products_inCart.length);
      $(".item-price").text(formatCash(totalPrice()) + " đ");

      $(".mini-shop-total").show();
      $(".mini-action-anchors").show();
      $(".item-counter").show();
      $(".item-price").show();
    }
  };

  // render mini cart
  const renderMiniCart = () => {
    if (products_inCart.length > 0) {
      $(".mini-cart-list").empty();
      $(".mini-total-price").empty();
      products_inCart.map((val) => {
        $(`
          <li class="clearfix item-cart" data-id=${val.productId}>
            <a class="item-img-wrapper-link-cart" href="single-product.html">
              <img src=${val.images[0].url} alt="Product" />
              <span class="mini-item-name">${val.productName}</span>
              <span class="mini-item-price">${formatCash(val.productPrice)} đ</span>
              <span class="mini-item-quantity"> x ${val.quantity} </span>
            </a>
          </li>
        `).appendTo(".mini-cart-list");
      });

      $(".mini-total-price").text(formatCash(totalPrice()) + " đ");
    } else {
      $(".mini-cart-list").empty();
      $(".mini-cart-list").html(
        `<div class="text-center d-flex flex-column justify-content-center align-items-center" style="height: 100%">
          
          <h5>Của bạn hàng hiện đang trống.</h5>
          <div class="redirect-link-wrapper u-s-p-t-25">
            <a class="redirect-link" href="shop.html">
              <span>Tiếp tục mua hàng</span>
            </a>
          </div>
        </div>`
      );
    }
  };

  // add product => cart
  $("body").on("click", ".add-cart-01", async function (e) {
    e.preventDefault();
    const currentId = $(this).parents(".item").data("id");
    const findItem = await $.get(`${url}/products/get_product/${currentId}`);
    let currentItem = findItem.result[0];

    const idx = products_inCart.findIndex((val) => val.productId === currentId);
    if (idx === -1) {
      currentItem.quantity = 1;
      currentItem.total = currentItem.quantity * currentItem.productPrice;
      products_inCart.push(currentItem);
    } else {
      products_inCart[idx].quantity += 1;
      products_inCart[idx].total =
        products_inCart[idx].quantity * products_inCart[idx].productPrice;
    }

    // luu localStorage
    $(".mini-cart-wrapper").addClass("mini-cart-open");
    await localStorage.setItem("products_inCart", JSON.stringify(products_inCart));
    render_all_cart();
  });

  // add product 2 => cart
  $("body").on("click", ".add-cart-02", async function (e) {
    e.preventDefault();
    const currentId = $(this).parents(".item-modal").data("id");
    const findItem = await $.get(`${url}/products/get_product/${currentId}`);
    let currentItem = findItem.result[0];
    let val_quantity = $(".val-quantity2").val();

    const idx = products_inCart.findIndex((val) => val.productId === currentId);
    if (idx === -1) {
      currentItem.quantity = Number(val_quantity);
      currentItem.total = currentItem.quantity * currentItem.productPrice;
      products_inCart.push(currentItem);
    } else {
      products_inCart[idx].quantity += Number(val_quantity);
      products_inCart[idx].total =
        products_inCart[idx].quantity * products_inCart[idx].productPrice;
    }

    // luu localStorage
    $(".mini-cart-wrapper").addClass("mini-cart-open");
    await localStorage.setItem("products_inCart", JSON.stringify(products_inCart));
    $("#quick-view").modal("hide");
    render_all_cart();
  });

  /**
   * Shows Newsletter Modal After 5sec = 5000milliseconds
   */
  const showNewsletterModal = function () {
    setTimeout(function () {
      // Manually opens a modal
      $("#newsletter-modal").modal("show");
    }, 5000);
  };
  /**
   * Initialize Main Slider
   */
  const sliderMain = function () {
    let $owl = $(".slider-main");
    $owl.owlCarousel({
      items: 1,
      autoplay: true,
      autoplayTimeout: 8000,
      loop: false,
      dots: false,
      rewind: true, // Go backwards when the boundary has reached
      nav: true, // Show next/prev buttons
      //   navContainerClass: 'owl-nav' by default,
      navElement: "div",
      navClass: ["main-slider-previous", "main-slider-next"], // Add these classes on navElement
      navText: ['<i class="fas fa-angle-left"></i>', '<i class="fas fa-angle-right"></i>'], // by default text prev, next will not show
    });
  };
  /**
   * Initialize owl-carousel for all product-place section on page
   */
  const productSlider = function () {
    // Get Collection of all Product Slider
    let $productsSlider = $(".products-slider");
    $productsSlider
      .on("initialize.owl.carousel", function () {
        $(this).closest(".slider-fouc").removeAttr("class");
      })
      .each(function () {
        let thisInstance = $(this);
        let itemPerLine = thisInstance.data("item");
        thisInstance.owlCarousel({
          autoplay: false,
          loop: false,
          dots: false,
          rewind: true,
          nav: true,
          navElement: "div",
          navClass: ["product-slider-previous", "product-slider-next"],
          navText: ['<i class="fas fa-angle-left"></i>', '<i class="fas fa-angle-right"></i>'],
          responsive: {
            0: {
              items: 1,
            },
            768: {
              items: itemPerLine - 2,
            },
            991: {
              items: itemPerLine - 1,
            },
            1200: {
              items: itemPerLine,
            },
          },
        });
      });
  };
  /**
   * Initialize owl-carousel for all Specific Category section on page
   */
  const SpecificCategorySlider = function () {
    // Get Collection of all Product Slider
    let $specificCategorySlider = $(".specific-category-slider");
    $specificCategorySlider
      .on("initialize.owl.carousel", function () {
        $(this).closest(".slider-fouc").removeAttr("class");
      })
      .each(function () {
        let thisInstance = $(this);
        let itemPerLine = thisInstance.data("item");
        thisInstance.owlCarousel({
          autoplay: false,
          loop: false,
          dots: false,
          rewind: true,
          nav: true,
          navElement: "div",
          navClass: ["specific-category-slider-previous", "specific-category-slider-next"],
          navText: ['<i class="fas fa-angle-left"></i>', '<i class="fas fa-angle-right"></i>'],
          responsive: {
            0: {
              items: 1,
            },
            768: {
              items: 2,
            },
            991: {
              items: itemPerLine - 1,
            },
            1200: {
              items: itemPerLine,
            },
          },
        });
      });
  };
  /**
   * On Product Slider Tabs: If content is hidden, Owl-carousel refuses to get the dimensions,
   * Sounds like because by default un-active `tab` is set to "display: none"
   * so it can't get the dimensions. Thus we Manually refresh the position on tab change.
   */
  const onTabChangeRefreshPositionOfCarousel = function () {
    // When showing a new tab, the events fire.
    // Specificity = 2
    $('.section-maker [data-toggle="tab"]').on("shown.bs.tab", function (e) {
      // Get the current click id of tab
      let $currentID = $(e.target).attr("href");
      // Trigger refresh `event` to current active `tab`
      $($currentID + ".active")
        .children()
        .trigger("refresh.owl.carousel");
    });
  };
  /**
   * Initialize owl-carousel for brand slider
   */
  const brandSlider = function () {
    let thisInstance = $(".brand-slider-content");
    let itemPerLine = thisInstance.data("item");
    thisInstance.owlCarousel({
      autoplay: true,
      autoplayTimeout: 8000,
      loop: false,
      dots: false,
      rewind: true,
      nav: true,
      navElement: "div",
      navClass: ["brand-slider-previous", "brand-slider-next"],
      navText: ['<i class="fas fa-angle-left"></i>', '<i class="fas fa-angle-right"></i>'],
      responsive: {
        0: {
          items: 1,
        },
        768: {
          items: 3,
        },
        991: {
          items: itemPerLine,
        },
        1200: {
          items: itemPerLine,
        },
      },
    });
  };

  $(async function () {
    // show product
    let products01 = await $.get(`${url}/products/get_all_product`);
    let products_new = await $.get(`${url}/products/get_product_new`);
    let products_hot = await $.get(`${url}/products/get_product_hot`);

    showProduct(products01, ".products-slider.owl-carousel.product1");
    showProduct(products_new, ".products-slider.owl-carousel.product-new");
    showProduct(products_hot, ".products-slider.owl-carousel.product-hot");

    render_all_cart();
    sliderMain();
    productSlider();
    SpecificCategorySlider();
    onTabChangeRefreshPositionOfCarousel();
    brandSlider();

    // show modal  =>  View product
    $("body").on("click", ".item-quick-look", async function (e) {
      e.preventDefault();
      e.stopPropagation();
      const currentId = $(this).parents(".item").data("id");

      const data_modal = await $.get(`${url}/products/get_product/${currentId}`);
      funcShowModal(data_modal, ".modal-body.view-product");

      $("#quick-view").modal("show");

      // Event on modal
      $("#zoom-pro-quick-view").elevateZoom({
        gallery: "gallery-quick-view",
        galleryActiveClass: "active",
        zoomEnabled: false, // false disables zoomwindow from showing
      });
    });

    // Event quantity
    $("body").on("click", ".minus-a", function () {
      let val_quantity = $(this).parents(".quantity").parent().find(".quantity-text-field").val();
      if (val_quantity > 1) {
        val_quantity -= 1;
      }
      $(this).parents(".quantity").parent().find(".quantity-text-field").val(val_quantity);
    });
    $("body").on("click", ".plus-a", function () {
      let val_quantity = $(this).parents(".quantity").parent().find(".quantity-text-field").val();
      let data_max = $(this).data("max");
      if (val_quantity < data_max) {
        val_quantity++;
      }
      $(this).parents(".quantity").parent().find(".quantity-text-field").val(val_quantity);
    });

    // Event view detail
    $("body").on("click", ".item-img-wrapper-link", async function (e) {
      // e.preventDefault();
      const currentId = $(this).parents(".item").data("id");
      localStorage.setItem("products_by_id", JSON.stringify(currentId));
    });
  });

  /**
   * Check everything including DOM elements and images loaded
   */
  $(window).on("load", function () {
    // showNewsletterModal();
    render_all_cart();
    $(".ph-item").removeClass("ph-item");
  });
})(jQuery, window, document);

/*============================================================================*/
/* Contact-page JavaScript functions
/*============================================================================*/
(function ($, window, document) {
  "use strict";
  /**
   * GoogleMap Init
   */
  const googleinitMap = function () {
    // Basic options for a simple Google Map
    // For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
    let mapOptions = {
      // How zoomed in you want the map to start at (always required)
      zoom: 11,
      scrollwheel: false,
      // The latitude and longitude to center the map (always required)
      center: new google.maps.LatLng(10.845918, 106.794171),
    };
    // Get the HTML DOM element that will contain your map
    // We are using a div with id="map" seen below in the <body>
    let mapElement = document.getElementById("map");
    // Create the Google Map using our element and options defined above
    let map = new google.maps.Map(mapElement, mapOptions);
    // Let's also add a marker while we're at it
    let marker = new google.maps.Marker({
      position: new google.maps.LatLng(10.845918, 106.794171),
      map: map,
    });
  };

  $(function () {
    // GoogleMap Init
    if ($("#map").length !== 0) {
      try {
        google.maps.event.addDomListener(window, "load", googleinitMap);
      } catch (e) {
        console.log('"Google Maps" refused to connect!');
      }
    }
  });
})(jQuery, window, document);

/*============================================================================*/
/* Product-Detail-page JavaScript functions
/*============================================================================*/
(function ($, window, document) {
  "use strict";
  //  Variables
  let $ratingField = $("#your-rating-value");
  let $starWidth = $("#your-stars");
  let $starComment = $("#star-comment");

  const product_by_id = localStorage.getItem("products_by_id") || "";

  /**
   * Rating Stars Control
   */
  const ratingStarsControl = function () {
    let oneStarWidth = 15; // 15 * 5 = 75
    let newStarWidth;
    let ratingthresholdNumber = 5;
    let comment;
    let currentVal;
    // On Every key type
    $ratingField.on("keyup", function () {
      // Reset Star Width
      $starWidth.css("width", 0);
      // Reset Comment
      $starComment.text("");
      // Always remember when when you enter any number and immediately enter some strings then parseFloat
      // function will truncate those strings and just only parse number so that's why i'm using this
      // check isNumeric
      if ($.isNumeric($ratingField.val())) {
        currentVal = parseFloat($ratingField.val());
      } else {
        currentVal = NaN;
      }
      /*
       * Format values
       * In JS if variable is not convert to number then by default variable is NaN.
       * We known JS has Truthy & Falsey values.
       * By default NaN (e.g. the result of 1/0) is false so its convert to true and expression
       * becomes true.
       */
      if (!currentVal || currentVal === "" || currentVal === "NaN" || currentVal === 0) {
        // if value is NaN
        currentVal = 0;
        $starWidth.css("width", 0);
        $starComment.text("");
      } else {
        if (currentVal >= 1 && currentVal <= ratingthresholdNumber) {
          if (currentVal === 1) {
            comment = "I hate it.";
          } else if (currentVal === 2) {
            comment = "I don't like it.";
          } else if (currentVal === 3) {
            comment = "It's OK.";
          } else if (currentVal === 4) {
            comment = "I like it.";
          } else if (currentVal === 5) {
            comment = "It's Perfect.";
          }
          // Precise Float value to only one decimal. example: 2.454544 to 2.5
          currentVal = currentVal.toFixed(1);
          // Manipulate Stars Width
          newStarWidth = oneStarWidth * currentVal;
          // Remove decimals from a variable, Convert float value to downward
          newStarWidth = Math.floor(newStarWidth);
          // Update Star Width
          $starWidth.css("width", newStarWidth);
          // Add Comment
          $starComment.text(comment);
        }
      }
    });
  };

  const renderDetailProduct = async () => {
    if (Number(product_by_id)) {
      $(".product-detail").empty();

      await $.get(`${url}/products/get_product/${product_by_id}`, function (data) {
        console.log(data);
        $(".text-detail").text(data.result[0].productName);
        $(`
          <div class="col-lg-6 col-md-6 col-sm-12">
            <!-- Product-zoom-area -->
            <div class="zoom-area">
              <img
                id="zoom-pro"
                class="img-fluid"
                src="${data.result[0].images[0].url}"
                data-zoom-image="${data.result[0].images[0].url}"
                alt="Zoom Image"
              />
              <div id="gallery" class="u-s-m-t-10">
                ${data.result[0].images.map(
                  (val, idx) =>
                    `<a
                    class='${idx === 0 ? "active" : ""}'
                    data-image=${val.url}
                    data-zoom-image=${val.url}
                  >
                    <img src=${val.url} alt="Product" />
                  </a>`
                )}
              </div>
            </div>
            <!-- Product-zoom-area /- -->
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 item-modal" data-id=${data.result[0].productId}>
            <!-- Product-details -->
            <div class="all-information-wrapper">
              <div class="section-1-title-breadcrumb-rating">
                <div class="product-title">
                  <h1>
                    <a href="single-product.html">${data.result[0].productName}</a>
                  </h1>
                </div>
                <div class="product-rating">
                  <div class="star" title="4.5 out of 5 - based on 23 Reviews">
                    <span style="width: 67px"></span>
                  </div>
                  <span>(${data.result[0].productAmount})</span>
                </div>
              </div>
              <div class="section-2-short-description u-s-p-y-14">
                <h6 class="information-heading u-s-m-b-8">Thông tin sản phẩm:</h6>
                <p>
                  ${data.result[0].productDes}
                </p>
              </div>
              <div class="section-3-price-original-discount u-s-p-y-14">
                <div class="price">
                  <span>Cân nặng:</span>
                  <p>${data.result[0].productMass}</p>
                </div>
              </div>
              <div class="section-3-price-original-discount u-s-p-y-14">
                <div class="price">
                  <span>Giá:</span>
                  <h4>${data.result[0].productPrice} đ</h4>
                </div>
              </div>
              <div class="section-6-social-media-quantity-actions u-s-p-y-14">
                <div class="quantity-wrapper u-s-m-b-22">
                  <span>Số lượng:</span>
                  <div class="quantity">
                    <input type="text" class="quantity-text-field val-quantity2" value="1" />
                    <a class="plus-a" data-max="1000">&#43;</a>
                    <a class="minus-a" data-min="1">&#45;</a>
                  </div>
                </div>
                <div>
                  <button class="button button-outline-secondary add-cart-02" type="submit">
                    Thêm vào giỏ hàng
                  </button>
                </div>
              </div>
            </div>
            <!-- Product-details /- -->
          </div>
        `).appendTo(".product-detail");
      });

      // Bind this plugin on Product `Detail` page
      $("#zoom-pro").elevateZoom({
        gallery: "gallery",
        galleryActiveClass: "active",
        borderSize: 1,
        zoomWindowWidth: 540,
        zoomWindowHeight: 540,
        zoomWindowOffetx: 10,
        borderColour: "#e9e9e9",
      });
    } else {
      let href = window.location.href;
      if (href.includes("single-product.html")) {
        document.location.href = "/";
      }
    }
  };

  $(function () {
    renderDetailProduct();
    // Rating Stars Control
    ratingStarsControl();
  });
})(jQuery, window, document);

/*============================================================================*/
/* Shop-page JavaScript functions
/*============================================================================*/
(function ($, window, document, undefined) {
  "use strict";
  //  Variables
  let $shopProductContainer = $(".product-container");
  let $searchFetchAllbtn = $(".fetch-categories ul > li > button");

  /**
   * Price Range Slider
   */
  const priceRangeSlider = function () {
    $(".price-slider-range").each(function () {
      // Get original minimum data value
      let queryMin = parseFloat($(this).data("min"));
      // Get original maximum data value
      let queryMax = parseFloat($(this).data("max"));
      // Get currency unit
      let currecyUnit = $(this).data("currency");
      // Get default minimum data value
      let defaultLow = parseFloat($(this).data("default-low"));
      // Get default maximum data value
      let defaultHigh = parseFloat($(this).data("default-high"));
      // Taking this
      let $instance = $(this);
      // Plugin invocation
      $(".price-filter").slider({
        range: true,
        min: queryMin,
        max: queryMax,
        values: [defaultLow, defaultHigh],
        slide: function (event, ui) {
          let result =
            '<div data-from="' +
            ui.values[0] +
            '" id="price-from" class="price-from">' +
            formatCash(ui.values[0]) +
            currecyUnit +
            '</div>\n<div data-to="' +
            ui.values[1] +
            '" id="price-to" class="price-to">' +
            formatCash(ui.values[1]) +
            currecyUnit +
            "</div>\n";
          $instance.parent().find(".amount-result").html(result);
        },
      });
    });
  };
  /**
   * Attach Click event to Grid & List
   */
  const attachClickGridAndList = function () {
    $("#list-anchor").on("click", function () {
      $(this).addClass("active");
      $(this).next().removeClass("active");
      $shopProductContainer.removeClass("grid-style");
      $shopProductContainer.addClass("list-style");
    });
    $("#grid-anchor").on("click", function () {
      $(this).addClass("active");
      $(this).prev().removeClass("active");
      $shopProductContainer.removeClass("list-style");
      $shopProductContainer.addClass("grid-style");
    });
  };
  /**
   * All Categories Functionality
   */
  const searchFetchAllCategoriesFunctionality = function () {
    $searchFetchAllbtn.on("click", function () {
      $(this).toggleClass("js-open");
      $(this).next("ul").stop(true, true).slideToggle();
    });
  };
  /**
   * Bind Slim Scroll Plugin to Associates Filters
   */
  const bindScrollWithAssociateFilters = function () {
    $(".associate-wrapper").each(function () {
      $(this).slimScroll({
        height: "auto",
        railClass: "grooverScrollRail", // default CSS class of the slimscroll rail
        barClass: "grooverScrollBar", // default CSS class of the slimscroll bar
        wrapperClass: "grooverScrollDiv", // default CSS class of the slimscroll wrapper
      });
    });
  };

  $(async function () {
    let products01 = await $.get(`${url}/products/get_all_product`);
    renderAllProducts(products01, ".list-all-products");
    // Price Range Slider
    priceRangeSlider();
    // Attach Click event to Grid & List
    attachClickGridAndList();
    // Bind Slim Scroll Plugin to Associates Filters
    bindScrollWithAssociateFilters();
    // All Categories Functionality
    searchFetchAllCategoriesFunctionality();
  });
})(jQuery, window, document);

/*============================================================================*/
/* Cart JavaScript functions
/*============================================================================*/
(function ($, window, document) {
  // take data localStorage
  const products_inCart_new = localStorage.getItem("products_inCart") || [];
  const products_inView = products_inCart_new.length ? JSON.parse(products_inCart_new) : [];
  let products_inCart = [...products_inView];

  // render all component cart
  const render_all_cart = () => {
    renderItemCounter();
    renderMiniCart();
  };

  // total price
  const totalPrice = () => products_inCart.reduce((acc, val) => acc + val.total, 0);

  // render item counter
  const renderItemCounter = () => {
    if (products_inCart.length === 0) {
      $(".item-counter").hide();
      $(".item-price").hide();
      $(".mini-shop-total").hide();
      $(".mini-action-anchors").hide();
    } else {
      $(".item-counter").text(products_inCart.length);
      $(".item-price").text(formatCash(totalPrice()) + " đ");

      $(".mini-shop-total").show();
      $(".mini-action-anchors").show();
      $(".item-counter").show();
      $(".item-price").show();
    }
  };

  // render mini cart
  const renderMiniCart = () => {
    if (products_inCart.length > 0) {
      $(".mini-cart-list").empty();
      $(".mini-total-price").empty();
      products_inCart.map((val) => {
        $(`
          <li class="clearfix item-cart" data-id=${val.productId}>
            <a class="item-img-wrapper-link-cart" href="single-product.html">
              <img src=${val.images[0].url} alt="Product" />
              <span class="mini-item-name">${val.productName}</span>
              <span class="mini-item-price">${formatCash(val.productPrice)} đ</span>
              <span class="mini-item-quantity"> x ${val.quantity} </span>
            </a>
          </li>
        `).appendTo(".mini-cart-list");
      });

      $(".mini-total-price").text(formatCash(totalPrice()) + " đ");
    } else {
      $(".mini-cart-list").empty();
      $(".mini-cart-list").html(
        `<div class="text-center d-flex flex-column justify-content-center align-items-center" style="height: 100%">
          <h5>Giỏ hàng của bạn đang trống.</h5>
          <div class="redirect-link-wrapper u-s-p-t-25">
            <a class="redirect-link" href="shop.html">
              <span>Quay lại</span>
            </a>
          </div>
        </div>`
      );
    }
  };

  // render tbody cart
  const renderTbodyCart = () => {
    if (products_inCart.length > 0) {
      $(".tbody-cart").empty();

      products_inCart.map((val) => {
        $(`
          <tr class="item-cart" data-id=${val.productId}>
            <td>
              <div class="cart-anchor-image">
                <a class="item-img-wrapper-link-cart" href="single-product.html">
                  <img src=${val.images[0].url} alt="Product" />
                  <h6>${val.productName}</h6>
                </a>
              </div>
            </td>
            <td>
              <div class="cart-price">${formatCash(val.productPrice)} đ</div>
            </td>
            <td>
              <div class="cart-quantity">
                <div class="quantity">
                  <input type="text" class="quantity-text-field" value=${val.quantity} />
                  <a class="plus-a" data-max="1000">&#43;</a>
                  <a class="minus-a" data-min="1">&#45;</a>
                </div>
              </div>
            </td>
            <td>
              <div class="action-wrapper">
                <button class="button button-outline-secondary fas fa-trash delete-item-cart"></button>
              </div>
            </td>
          </tr>
        `).appendTo(".tbody-cart");
      });
    } else {
      let href = window.location.href;
      if (href.includes("cart.html")) {
        document.location.href = "/cart-empty.html";
      }
    }
  };

  $(function () {
    renderTbodyCart();

    // btn-delete products
    $("body").on("click", ".delete-item-cart", async function (e) {
      e.preventDefault();
      let cartId = $(this).parents(".item-cart").data("id");
      products_inCart = products_inCart.filter((val) => val.productId !== cartId);

      // save localStorage
      await localStorage.setItem("products_inCart", JSON.stringify(products_inCart));
      renderTbodyCart();
      render_all_cart();
    });

    // btn update products cart
    $("body").on("click", ".update_cart", function (e) {
      e.preventDefault();
      $.each($(".quantity-text-field"), (index, value) => {
        let valQuantity = $(value).val();
        let cartId = $(value).parents(".item-cart").data("id");
        const idx = products_inCart.findIndex((val) => val.productId === cartId);
        products_inCart[idx].quantity = Number(valQuantity);
        products_inCart[idx].total =
          products_inCart[idx].quantity * products_inCart[idx].productPrice;
      });

      // save localStorage
      localStorage.setItem("products_inCart", JSON.stringify(products_inCart));
      renderTbodyCart();
      render_all_cart();
      $("#modal-update").modal("show");
    });

    // Event view detail
    $("body").on("click", ".item-img-wrapper-link-cart", async function (e) {
      // e.preventDefault();
      const currentId = $(this).parents(".item-cart").data("id");
      localStorage.setItem("products_by_id", JSON.stringify(currentId));
    });
  });
})(jQuery, window, document);

// product by category
$(async function () {
  let category = JSON.parse(localStorage.getItem("get_category"));
  let id_custom_detail = localStorage.getItem("id_custom_detail");

  if (category) {
    let data_product_by_cate = await $.get(
      `${url}/products/get_product_by_category/${category.categoryId}`
    );

    $(".btn-filter").click(function (e) {
      e.preventDefault();
      let min_price = $("#price-from").data("from");
      let max_price = $("#price-to").data("to");

      let data_filter = {
        result: [],
      };

      data_product_by_cate.result = data_product_by_cate.result.filter(
        (val) => val.productPrice <= max_price && val.productPrice >= min_price
      );

      renderAllProducts(data_product_by_cate, ".list-product-by-category");
    });

    renderAllProducts(data_product_by_cate, ".list-product-by-category");
  }

  if (id_custom_detail) {
    let data_custom_detail = await $.get(`${url}/products/${id_custom_detail}`);

    renderAllProducts02(data_custom_detail, ".list-product-detail");
  }
});

// login register
$(async function () {
  await funcCheckLogin();
  funcCheckOutProduct();
  funcALlBill();

  $("body").on("click", ".btn-login-register", function (e) {
    e.preventDefault();
    localStorage.removeItem("token");
    window.location.href = "account.html";
  });

  $("body").on("click", ".btn-logout", function (e) {
    e.preventDefault();
    localStorage.removeItem("token");
    window.location.href = "account.html";
  });

  $(".btn-register").click(function (e) {
    let username = $("#user-name").val();
    let email = $("#email").val();
    let password = $("#password").val();
    let phonenumber = $("#phonenumber").val();
    let address = $("#address").val();

    if (username && email && password && phonenumber && address) {
      $.ajax({
        url: `${url}/users/register`,
        type: "POST",
        data: {
          email,
          password,
          address,
          fullName: username,
          phone: phonenumber,
        },
        success: function (data) {
          if (data) {
            alert("Đăng ký thành công!");
          }
        },
        error: function (error) {
          console.log(error);
          alert("Đăng ký không thành công!");
        },
      });
    } else {
      alert("Vui lòng nhập đầy đủ thông tin!");
    }

    e.preventDefault();
  });

  $(".btn-login").click(function (e) {
    if ($("#login-email").val() && $("#login-password").val()) {
      $.ajax({
        type: "POST",
        url: `${url}/login`,
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({
          email: $("#login-email").val(),
          password: $("#login-password").val(),
        }),
        success: function (response) {
          localStorage.setItem("token", response.token);
          window.history.back();
        },
        error: function (error) {
          alert("Tài khoản hoặc mật khẩu không đúng!");
          console.log(error);
        },
      });
    } else {
      alert("Vui lòng nhập đầy đủ thông tin!");
    }

    e.preventDefault();
  });

  $(".btn-update-user").click(function (e) {
    e.preventDefault();
    let fullName = $("#req-st-name").val();
    let password = $("#req-st-password").val();
    let address = $("#req-st-address").val();
    let phone = $("#req-st-phone").val();

    // const form = $("#form-update");

    if (!password) {
      alert("Vui lòng nhập mật khẩu");
    } else {
      $.ajax({
        type: "PUT",
        url: `${url}/users/update_user`,
        // crossDomain: true,
        contentType: "application/json",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        // data: form.serialize(),
        data: JSON.stringify({
          phone,
          password,
          fullName,
          address,
          email: localStorage.getItem("email"),
        }),
        success: function (response) {
          if (response) alert("Sửa thành công");
        },
        error: function (error) {
          console.log(error);
          alert(error.responseText);
        },
      });
    }
  });

  $(".btn-update-password").click(function (e) {
    e.preventDefault();
    if ($("#form-update").hasClass("show")) {
      $(".btn-update-password").text("Back");
    } else {
      $(".btn-update-password").text("Đổi mật khẩu");
    }
    $("#form-update").toggleClass("show");
    $("#form-update-pw").toggleClass("show");
  });

  $("body").on("click", ".btn-update-pw", function (e) {
    e.preventDefault();

    if (!$("#req-st-password-old").val() && !$("#req-st-password-new").val()) {
      alert("Vui lòng nhật đầy đủ thông tin!");
    } else {
      $.ajax({
        type: "PUT",
        url: `${url}/users/change_password`,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        data: JSON.stringify({
          email: localStorage.getItem("email"),
          oldPassword: $("#req-st-password-old").val(),
          newPassword: $("#req-st-password-new").val(),
        }),
        contentType: "application/json",
        success: function (response) {
          if (response) alert("Cập nhật mật khẩu thành công");
        },
        error: function (error) {
          console.log(error);
          alert(error.responseText);
        },
      });
    }
  });
});

// Show product
const showProduct = (data, element) => {
  $(element).empty();
  data.result.map((val, index) => {
    index <= 8 &&
      $(`
        <div data-id=${val.productId} class="item">
          <div class="image-container">
            <a class="item-img-wrapper-link" href="single-product.html">
              <img class="img-fluid" src=${val.images[0].url} alt="Product" />
            </a>
            <div class="item-action-behaviors">
              <a class="item-quick-look" href="#quick-view">Quick Look</a>
              <a class="item-addCart add-cart-01" href="javascript:void(0)">Thêm vào giỏ hàng</a>
            </div>
          </div>
          <div class="item-content">
            <div class="what-product-is">
              <h6 class="item-title">
                <a href="single-product.html">${val.productName}</a>
              </h6>
            </div>
            <div class="price-template">
              <div class="item-new-price">${formatCash(val.productPrice)} đ</div>
            </div>
          </div>
        </div>
  `).appendTo(element);
  });
};

// render all products
const renderAllProducts = (data, element) => {
  $(element).empty();
  data.result.map((val) => {
    $(`
      <div class="product-item col-lg-4 col-md-6 col-sm-6">
        <div class="item" data-id=${val.productId}>
          <div class="image-container">
            <a class="item-img-wrapper-link" href="single-product.html">
              <img class="img-fluid" src=${val.images[0].url} alt="Product" />
            </a>
            <div class="item-action-behaviors">
              <a class="item-quick-look" data-toggle="modal" href="#quick-view"
                >Quick Look</a
              >
              <a class="item-addCart add-cart-01" href="javascript:void(0)">Thêm vào giỏ hàng</a>
            </div>
          </div>
          <div class="item-content">
            <div class="what-product-is">
              <h6 class="item-title">
                <a href="single-product.html">${val.productName}</a>
              </h6>
              <div class="item-description">
                <p>
                ${val.productDes}
                </p>
              </div>
            </div>
            <div class="price-template">
              <div class="item-new-price">${formatCash(val.productPrice)} đ</div>
            </div>
          </div>
        </div>
      </div>
    `).appendTo(element);
  });
};
const renderAllProducts02 = (data, element) => {
  $(element).empty();
  data.result.map((val) => {
    $(`
      <div class="product-item col-lg-3 col-md-6 col-sm-6">
        <div class="item" data-id=${val.productId}>
          <div class="image-container">
            <a class="item-img-wrapper-link" href="single-product.html">
              <img class="img-fluid" src=${val.images[0].url} alt="Product" />
            </a>
            <div class="item-action-behaviors">
              <a class="item-quick-look" data-toggle="modal" href="#quick-view"
                >Quick Look</a
              >
              <a class="item-addCart add-cart-01" href="javascript:void(0)">Thêm vào giỏ hàng</a>
            </div>
          </div>
          <div class="item-content">
            <div class="what-product-is">
              <h6 class="item-title">
                <a href="single-product.html">${val.productName}</a>
              </h6>
              <div class="item-description">
                <p>
                ${val.productDes}
                </p>
              </div>
            </div>
            <div class="price-template">
              <div class="item-new-price">${formatCash(val.productPrice)} đ</div>
            </div>
          </div>
        </div>
      </div>
    `).appendTo(element);
  });
};

// Show modal
const funcShowModal = (data, element) => {
  $(element).empty();
  $(`
    <div class="row item-modal" data-id=${data.result[0].productId}>
      <div class="col-lg-6 col-md-6 col-sm-12">
        <!-- Product-zoom-area -->
        <div class="zoom-area">
          <img
            id="zoom-pro-quick-view"
            class="img-fluid"
            src=${data.result[0].images[0].url}
            data-zoom-image=${data.result[0].images[0].url}
            alt="Zoom Image"
          />
          <div id="gallery-quick-view" class="u-s-m-t-10">
            ${data.result[0].images.map(
              (val, idx) =>
                `<a
                class='${idx === 0 ? "active" : ""}'
                data-image=${val.url}
                data-zoom-image=${val.url}
              >
                <img src=${val.url} alt="Product" />
              </a>`
            )}
          </div>
        </div>
        <!-- Product-zoom-area /- -->
      </div>
      <div class="col-lg-6 col-md-6 col-sm-12">
        <!-- Product-details -->
        <div class="all-information-wrapper" style="padding-top: 10px">
          <div class="section-1-title-breadcrumb-rating">
            <div class="product-title">
              <h1>
                <a href="single-product.html">${data.result[0].productName}</a>
              </h1>
            </div>
          </div>
          <div class="section-2-short-description u-s-p-y-14">
            <h6 class="information-heading u-s-m-b-8">Thông tin sản phẩm:</h6>
            <p>
            ${data.result[0].productDes}
            </p>
          </div>
          <div class="section-3-price-original-discount u-s-p-y-14">
            <div class="price">
            <span>Giá:</span>
              <h4>${formatCash(data.result[0].productPrice)} đ</h4>
            </div>
          </div>
          <div class="section-4-sku-information u-s-p-y-14">
            <h6 class="information-heading u-s-m-b-8">Số lượng còn lại:</h6>
            <div class="left">
              <span>Số lượng:</span>
              <span>${data.result[0].productAmount}</span>
            </div>
            <div class="left">
              <span>Cân nặng:</span>
              <span>${data.result[0].productMass}</span>
            </div>
          </div>
          <div class="section-6-social-media-quantity-actions u-s-p-y-14">
            <div class="quantity-wrapper u-s-m-b-22">
              <span>Số lượng:</span>
              <div class="quantity">
                <input type="text" class="quantity-text-field val-quantity2" value="1" />
                <a class="plus-a" data-max=${data.result[0].productAmount}>&#43;</a>
                <a class="minus-a" data-min="1">&#45;</a>
              </div>
            </div>
            <div>
              <button class="button button-outline-secondary add-cart-02" type="submit">
                Thêm vào giỏ hàng
              </button>
            </div>
          </div>
        </div>
        <!-- Product-details /- -->
      </div>
    </div>
  `).appendTo(element);
};

// Show category
const funcShowCategory02 = (data, element) => {
  $(element).empty();
  data.result.map((val) => {
    $(`
       <h3 class="fetch-mark-category">
        <a class="item-category" data-id=${val.categoryId} href="shop-category.html" >
        ${val.categoryName}
        </a>
      </h3>
    `).appendTo(element);
  });
};
const funcShowCategory = (data, element) => {
  $(element).empty();
  data.result.map((val) => {
    $(`
      <li>
        <a class="item-category" data-id=${val.categoryId} href="shop-category.html" >
          ${val.categoryName}
        </a>
      </li>
    `).appendTo(element);
  });
};

const funcShowCategoryOption = (data, element) => {
  $(element).empty();
  $(`<option selected="selected" value="">Tất cả</option>`).appendTo(element);
  data.result.map((val) => {
    $(`
    <option value=${val.categoryId}>${val.categoryName}</option>
    `).appendTo(element);
  });
};

//Set name category
const funcSetNameCategory = () => {
  $(".name-category").empty();
  let category = JSON.parse(localStorage.getItem("get_category")) || "";

  $(".name-category").text(category ? category.categoryName : "");
};
//Set name category
const funcSetNameCategory02 = () => {
  $(".name-detail-product").empty();
  let id_custom_detail = localStorage.getItem("id_custom_detail");

  if (id_custom_detail) {
    if (id_custom_detail == "get_product_new") {
      $(".name-detail-product").text("Sản Phẩm Mới");
    } else {
      $(".name-detail-product").text("Sản Phẩm Bán Chạy");
    }
  }
};

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
        if (data) {
          $(".check-login").empty();
          $(`
            <div class="btn-logout">
              <i class="fas fa-sign-in-alt u-s-m-r-9"></i>
              <span>Đăng xuất</span>
            </div>
          `).appendTo(".check-login");

          //
          $("#req-st-name").val(data.fullName);
          $("#req-st-email").val(data.email);
          localStorage.setItem("email", data.email);
          $("#req-st-address").val(data.address);
          $("#req-st-phone").val(data.phone);
          $(".user-check").css("display", "block");
        }
      },
      error: function (error) {
        console.log("err", error);
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        $(".check-login").empty();
        $(`
          <div class="btn-login-register">
            <i class="fas fa-sign-in-alt u-s-m-r-9"></i>
            <span>Đăng nhập / Đăng Ký</span>
          </div>
          `).appendTo(".check-login");

        $(".user-check").css("display", "none");

        let href = window.location.href;
        if (href.includes("checkout.html")) {
          window.location.href = "/account.html";
        }
      },
    });
  } else {
    $(".check-login").empty();
    $(`
      <div class="btn-login-register">
        <i class="fas fa-sign-in-alt u-s-m-r-9"></i>
        <span>Đăng nhập / Đăng Ký</span>
      </div>
    `).appendTo(".check-login");
    $(".user-check").css("display", "none");

    let href = window.location.href;
    if (href.includes("checkout.html")) {
      window.location.href = "/account.html";
    }
  }
};

const funcCheckOutProduct = () => {
  // take data localStorage
  const products_inCart_new = localStorage.getItem("products_inCart") || [];
  const products_inView = products_inCart_new.length ? JSON.parse(products_inCart_new) : [];
  let products_inCart = [...products_inView];

  if (products_inCart.length > 0) {
    $(".checkout-products").empty();
    products_inCart.map((val) => {
      $(`
      <tr>
        <td>
          <h6 class="order-h6">${val.productName}</h6>
          <span class="order-span-quantity">x ${val.quantity}</span>
        </td>
        <td>
          <h6 class="order-h6">${formatCash(val.total)} đ</h6>
        </td>
      </tr>
    `).appendTo(".checkout-products");
    });
  } else {
    let href = window.location.href;
    if (href.includes("/checkout.html")) {
      window.location.href = "/shop.html";
    }
  }

  $(".btn-order").click(function (e) {
    e.preventDefault();
    let itemInfos = products_inCart.map((val) => {
      return {
        productId: Number(val.productId),
        amount: Number(val.quantity),
      };
    });

    $.ajax({
      type: "POST",
      url: `${url}/bills/add_bill`,

      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },

      contentType: "application/json",
      data: JSON.stringify(itemInfos),
      success: function (response) {
        alert("Đặt hàng thành công!");
        localStorage.removeItem("products_inCart");

        window.location.href = "/confirmation.html";
      },

      error: function (error) {
        console.log(error);
        alert(error.responseText);
      },
    });
  });
};

const funcALlBill = () => {
  if (localStorage.getItem("token")) {
    $.ajax({
      type: "GET",
      url: `${url}/users/get_all_bill`,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      success: function (response) {
        $(".user-all-bill").empty();

        if (response.length > 0) {
          response.map((val) => {
            $(`
          <tr>
            <th scope="row">#${val.billId}</th>
            <td>${val.purchaseDate}</td>
            <td>${val.purchaserEmail}</td>
            <td>${val.status && val.status === "NEW" ? "Đang giao hàng" : "Đã giao hàng"}</td>
            <td>${formatCash(val.price)}đ</td>
            <td><button class="btn btn-danger btn-xem-bill" data-id=${val.billId}>Xem</button></td>
          </tr>
        `).appendTo(".user-all-bill");
          });
        } else {
          $(".user-all-bill").empty();
          $(".user-all-bill").text("Bạn chưa mua đơn hàng nào!");
        }
      },
    });
  }

  $("body").on("click", ".btn-xem-bill", function (e) {
    e.preventDefault();
    $(".bill-by-id").show();
    $(".all-bill-user").hide();
    let id = $(this).data("id");

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
        $(".bill-name").text(`${response.result[0].userResponse.fullName}`);
        $(".bill-sdt").text(`${response.result[0].userResponse.phone}`);
        $(".bill-email").text(`${response.result[0].userResponse.email}`);
        $(".bill-address").text(`${response.result[0].userResponse.address}`);
        $(".singleOrder-total").text(`${formatCash(response.result[0].totalPrice)}đ`);
        $(".bill-priceShip").text(`${formatCash(response.result[0].feeShip)}đ`);
        $(".priceTotal").text(
          `${formatCash(
            Number(response.result[0].feeShip) + Number(response.result[0].totalPrice)
          )}đ`
        );

        $(".bill-status").empty();

        $(".bill-status").text(
          response.result[0].status === "NEW" ? "Đang giao hàng" : "Đã giao hàng"
        );

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

            <span class="singleOrder__main--card--item--countWrapper"> ${
              val.amountPurchased
            } </span>
          </div>

          <div
            class="singleOrder__main--card--item--details bill-content"
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
  });
};

import { Injectable } from '@angular/core';
declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class NavService {
  initHorizontalNavbarMenu() {
    const tabsNewAnim = $('#navbar-animmenu');
    const selectorNewAnim = $('#navbar-animmenu').find('li').length;
    const activeItemNewAnim = tabsNewAnim.find('.active');
    const activeWidthNewAnimWidth = activeItemNewAnim.innerWidth();
    const itemPosNewAnimLeft = activeItemNewAnim.position();

    $(".hori-selector").css({
      "left": itemPosNewAnimLeft.left + "px",
      "width": activeWidthNewAnimWidth + "px"
    });

    $("#navbar-animmenu").on("click", "li", (e: any) => {
      $('#navbar-animmenu ul li').removeClass("active");
      $(e.currentTarget).addClass('active');

      const activeWidthNewAnimWidth = $(e.currentTarget).innerWidth();
      const itemPosNewAnimLeft = $(e.currentTarget).position();

      $(".hori-selector").css({
        "left": itemPosNewAnimLeft.left + "px",
        "width": activeWidthNewAnimWidth + "px"
      });
    });
  }

  init() {
    this.initHorizontalNavbarMenu();
  }
}

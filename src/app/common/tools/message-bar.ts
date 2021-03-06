import "jquery-toast-plugin";

export class MessageBar {
  static response_success(text?: string) {
    $.toast({
      text: text ? text : "操作成功",
      position: "bottom-right",
      loaderBg: "#ff6849",
      icon: "success",
      hideAfter: 3500,
      stack: 6,
    });
  }
  static response_Error(text?: string) {
    $.toast({
      text: text ? text : "操作失败",
      position: "bottom-right",
      loaderBg: "#e6294b",
      icon: "error",
      hideAfter: 35000,
      stack: 6,
    });
  }

  static response_warning(text?: string) {
    $.toast({
      text: text ? text : "正在操作中...",
      position: "bottom-right",
      loaderBg: "#ffb22b",
      icon: "warning",
      hideAfter: 3500 * 2,
      stack: 6,
    });
  }

  static confirm(text: string, fn: Function) {
    $.confirm({
      text: text,
      okButton: "确定",
      cancelButton: "取消",
      okButtonClass: "custom green  p-r-20 p-l-20",
      cancelButtonClass: "switch blue p-r-20 p-l-20",
      top: -1,
      confirm: function () {
        fn();
      },
    });
  }
}

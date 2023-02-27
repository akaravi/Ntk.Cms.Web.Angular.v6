import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ErrorExceptionResultBase } from 'ntk-cms-api';

@Injectable({
  providedIn: 'root'
})
export class CmsToastrService {
  constructor(
    public toastr: ToastrService,
    public translate: TranslateService,
  ) {

  }
  private now(): string {
    const myDate = new Date();
    const retStr = myDate.getHours() + ' : ' + myDate.getMinutes() + ' : ' + myDate.getSeconds() + ' => ';
    return '';
  }
  // typeOrderAction
  typeOrderActionLogout(): void {
    // this.toastr.info('درحال اجرای خروج از حساب کاربری.', this.now() + 'Info!');
    this.toastr.success(this.translate.instant('ERRORMESSAGE.MESSAGE.typeOrderActionLogout'), this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeOrderActionLogout'));
  }
  // Success Type
  typeSuccessAccessChange(): void {
    // this.toastr.success('دسترسی با موفقیت تایید شد', this.now() + 'Success!');
    this.toastr.success(this.translate.instant('ERRORMESSAGE.MESSAGE.typeSuccessAccessChange'), this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeSuccessAccessChange'));
  }
  typeSuccessAddFirstSite(): void {
    // this.toastr.success('با موفقیت  اولین سامانه شما اضافه شد', this.now() + 'Success!');
    this.toastr.success(this.translate.instant('ERRORMESSAGE.MESSAGE.typeSuccessAddFirstSite'), this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeSuccessAddFirstSite'));
  }
  typeSuccessMessage(message: string): void {
    this.toastr.success(message, this.now() + 'Success!');
  }
  typeSuccessCopedToClipboard(): void {
    // this.toastr.success('با موفقیت اضافه شد', this.now() + 'Success!');
    this.toastr.success(this.translate.instant('ERRORMESSAGE.MESSAGE.typeSuccessCopedToClipboard'), this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeSuccessAdd'));
  }
  typeSuccessAdd(): void {
    // this.toastr.success('با موفقیت اضافه شد', this.now() + 'Success!');
    this.toastr.success(this.translate.instant('ERRORMESSAGE.MESSAGE.typeSuccessAdd'), this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeSuccessAdd'));
  }
  typeSuccessAddSimilar(): void {
    // this.toastr.success('با موفقیت مطالب مشابه اضافه شد', this.now() + 'Success!');
    this.toastr.success(this.translate.instant('ERRORMESSAGE.MESSAGE.typeSuccessAddSimilar'), this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeSuccessAddSimilar'));
  }
  typeSuccessAddOtherInfo(): void {
    // this.toastr.success('با موفقیت سایر اطلاعات اضافه شد', this.now() + 'Success!');
    this.toastr.success(this.translate.instant('ERRORMESSAGE.MESSAGE.typeSuccessAddOtherInfo'), this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeSuccessAddOtherInfo'));
  }
  typeSuccessAddTag(): void {
    // this.toastr.success('با موفقیت تگ مشابه اضافه شد', this.now() + 'Success!');
    this.toastr.success(this.translate.instant('ERRORMESSAGE.MESSAGE.typeSuccessAddTag'), this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeSuccessAddTag'));
  }
  typeSuccessRemoveTag(): void {
    // this.toastr.success('با موفقیت تگ مشابه حذف شد', this.now() + 'Success!');
    this.toastr.success(this.translate.instant('ERRORMESSAGE.MESSAGE.typeSuccessRemoveTag'), this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeSuccessRemoveTag'));
  }
  typeSuccessSetStatus(str: string): void {
    // let message = 'با موفقیت اضافه شد';
    let message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeSuccessSetStatus');

    if (str && str.length > 0) {
      message = message + ' ' + this.translate.instant('ERRORMESSAGE.TITLE.Success') + ': ' + str;
    }
    this.toastr.success(message, this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeSuccessSetStatus'));
  }
  typeSuccessRemoveOtherInfo(): void {
    // this.toastr.success('با موفقیت سایر اطلاعات حذف شد', this.now() + 'Success!');
    this.toastr.success(this.translate.instant('ERRORMESSAGE.MESSAGE.typeSuccessRemoveOtherInfo'), this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeSuccessRemoveOtherInfo'));
  }
  typeSuccessRemoveSimilar(): void {
    // this.toastr.success('با موفقیت سایر اطلاعات مشابه حذف شد', this.now() + 'Success!');
    this.toastr.success(this.translate.instant('ERRORMESSAGE.MESSAGE.typeSuccessRemoveSimilar'), this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeSuccessRemoveSimilar'));
  }
  typeSuccessRemove(): void {
    // this.toastr.success('با موفقیت حذف شد', this.now() + 'Success!');
    this.toastr.success(this.translate.instant('ERRORMESSAGE.MESSAGE.typeSuccessRemove'), this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeSuccessRemove'));
  }

  typeSuccessEdit(): void {
    // this.toastr.success('با موفقیت ویرایش شد', this.now() + 'Success!');
    this.toastr.success(this.translate.instant('ERRORMESSAGE.MESSAGE.typeSuccessEdit'), this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeSuccessEdit'));
  }
  typeSuccessChangePassword(): void {
    // this.toastr.success('کلمه عبور شما با موفقیت ویرایش شد', this.now() + 'Success!');
    this.toastr.success(this.translate.instant('ERRORMESSAGE.MESSAGE.typeSuccessChangePassword'), this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeSuccessChangePassword'));
  }
  typeSuccessMove(): void {
    // this.toastr.success('با موفقیت منتقل شد', this.now() + 'Success!');
    this.toastr.success(this.translate.instant('ERRORMESSAGE.MESSAGE.typeSuccessMove'), this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeSuccessMove'));
  }
  typeSuccessLogin(): void {
    // this.toastr.success('با موفقیت به حساب کاربری خود وارد شدید', this.now() + 'Success!');
    this.toastr.success(this.translate.instant('ERRORMESSAGE.MESSAGE.typeSuccessLogin'), this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeSuccessLogin'));
  }
  typeSuccessLogout(): void {
    // this.toastr.success('با موفقیت از حساب کاربری خود خارج شدید', this.now() + 'Success!');
    this.toastr.success(this.translate.instant('ERRORMESSAGE.MESSAGE.typeSuccessLogout'), this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeSuccessLogout'));
  }
  typeSuccessEmailConfirm(): void {
    // this.toastr.success('ایمیل شما با موفقیت تایید شد', this.now() + 'Success!');
    this.toastr.success(this.translate.instant('ERRORMESSAGE.MESSAGE.typeSuccessEmailConfirm'), this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeSuccessEmailConfirm'));
  }
  typeSuccessRegistery(): void {
    // this.toastr.success('با موفقیت حساب کاربری شما ساخته شد', this.now() + 'Success!');
    this.toastr.success(this.translate.instant('ERRORMESSAGE.MESSAGE.typeSuccessRegistery'), this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeSuccessRegistery'));
  }
  typeSuccessSelected(): void {
    // this.toastr.success('با موفقیت انتخاب شد', this.now() + 'Success!');
    this.toastr.success(this.translate.instant('ERRORMESSAGE.MESSAGE.typeSuccessSelected'), this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeSuccessSelected'));
  }
  typeSuccessAppBuild(str: string): void {
    // let message = 'دستور ساخت اپ ثب شد';
    let message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeSuccessAppBuild');
    if (str && str.length > 0) {
      message = message + ' ' + this.translate.instant('ERRORMESSAGE.TITLE.Message') + ': ' + str;
    }
    this.toastr.success(message, this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeSuccessAppBuild'));
  }
  typeSuccessAppUpload(): void {
    // this.toastr.success('با موفقیت آپلود شد', this.now() + 'Success!');
    this.toastr.success(this.translate.instant('ERRORMESSAGE.MESSAGE.typeSuccessAppUpload'), this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeSuccessAppUpload'));
  }
  // error Type
  typeErrorInternetConnection(str: string = ''): void {
    // let message = 'خطا در اتصال به اینترنت.لطفا اتصال به اینترنت را بررسی کنید';
    let message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorInternetConnection');

    if (str && str.length > 0) {
      message = message + ' ' + this.translate.instant('ERRORMESSAGE.TITLE.Error') + ': ' + str;
    }
    this.toastr.error(message, this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeErrorInternetConnection'));
  }
  typeErrorUserToken(str: string = ''): void {
    // let message = 'حساب کاربری شما مورد تایید نمی باشد.لطفا مجدد وارد حساب کاربری شوید';
    let message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorUserToken');

    if (str && str.length > 0) {
      message = message + ' ' + this.translate.instant('ERRORMESSAGE.TITLE.Error') + ': ' + str;
    }
    this.toastr.error(message, this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeErrorUserToken'));
  }
  typeErrorAccessChange(str: string = ''): void {
    // let message = 'دسترسی جدید تایید نشد';
    let message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorAccessChange');

    if (str && str.length > 0) {
      message = message + ' ' + this.translate.instant('ERRORMESSAGE.TITLE.Error') + ': ' + str;
    }
    this.toastr.error(message, this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeErrorAccessChange'));
  }
  typeErrorDeviceToken(str: string = ''): void {
    // let message = 'شناسه دستگاه شما مورد تایید نمی باشد.اطفا با پستبانی تماس بگیرید';
    let message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorDeviceToken');

    if (str && str.length > 0) {
      message = message + ' ' + this.translate.instant('ERRORMESSAGE.TITLE.Error') + ': ' + str;
    }
    this.toastr.error(message, this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeErrorDeviceToken'));
  }

  typeErrorComponentAction(str: string = ''): void {
    // let message = 'نوع فعالیت در این صفحه مشخص نمی باشد';
    let message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorComponentAction');

    if (str && str.length > 0) {
      message = message + ' ' + this.translate.instant('ERRORMESSAGE.TITLE.Error') + ': ' + str;
    }
    this.toastr.error(message, this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeErrorComponentAction'));
  }

  typeErrorFormInvalid(str: string = ''): void {
    // let message = 'مقادیر فرم مورد تایید نمی باشد';
    let message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorFormInvalid');

    if (str && str.length > 0) {
      message = message + ' ' + this.translate.instant('ERRORMESSAGE.TITLE.Error') + ': ' + str;
    }
    this.toastr.error(message, this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeErrorFormInvalid'));
  }
  typeErrorGetAccess(str: string = ''): void {
    // let message = 'خطا در دریافت دسترسی های ';
    let message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorGetAccess');

    if (str && str.length > 0) {
      message = message + ' ' + this.translate.instant('ERRORMESSAGE.TITLE.Error') + ': ' + str;
    }
    this.toastr.error(message, this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeErrorGetAccess'));
  }
  typeErrorAccessAdd(str: string = ''): void {
    // let message = 'دسترسی اضافه کردن  ندارید';
    let message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorAccessAdd');

    if (str && str.length > 0) {
      message = message + ' ' + this.translate.instant('ERRORMESSAGE.TITLE.Error') + ': ' + str;
    }
    this.toastr.error(message, this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeErrorAccessAdd'));
  }
  typeErrorAccessWatch(str: string = ''): void {
    // let message = 'دسترسی مشاهده کردن ندارید';
    let message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorAccessWatch');

    if (str && str.length > 0) {
      message = message + ' ' + this.translate.instant('ERRORMESSAGE.TITLE.Error') + ': ' + str;
    }
    this.toastr.error(message, this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeErrorAccessWatch'));
  }
  typeErrorAccessEdit(str: string = ''): void {
    // let message = 'دسترسی ویرایش کردن ندارید';
    let message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorAccessEdit');

    if (str && str.length > 0) {
      message = message + ' ' + this.translate.instant('ERRORMESSAGE.TITLE.Error') + ': ' + str;
    }
    this.toastr.error(message, this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeErrorAccessEdit'));
  }
  typeErrorAccessDelete(str: string = ''): void {
    // let message = 'دسترسی حذف کردن ندارید';
    let message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorAccessDelete');

    if (str && str.length > 0) {
      message = message + ' ' + this.translate.instant('ERRORMESSAGE.TITLE.Error') + ': ' + str;
    }
    this.toastr.error(message, this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeErrorAccessDelete'));
  }
  typeErrorGetOne(str: string = ''): void {
    // let message = 'خطا در دریافت ردیف ';
    let message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorGetOne');

    if (str && str.length > 0) {
      message = message + ' ' + this.translate.instant('ERRORMESSAGE.TITLE.Error') + ': ' + str;
    }
    this.toastr.error(message, this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeErrorGetOne'));
  }

  typeErrorSetStatus(str: string = ''): void {
    // let message = 'خطا در تغییر وضعیت ';
    let message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorSetStatus');

    if (str && str.length > 0) {
      message = message + ' ' + this.translate.instant('ERRORMESSAGE.TITLE.Error') + ': ' + str;
    }
    this.toastr.error(message, this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeErrorSetStatus'));
  }
  typeErrorGetAll(str: string = ''): void {
    // let message = 'خطا در دریافت لیست ';
    let message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorGetAll');

    if (str && str.length > 0) {
      message = message + ' ' + this.translate.instant('ERRORMESSAGE.TITLE.Error') + ': ' + str;
    }
    this.toastr.error(message, this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeErrorGetAll'));
  }

  typeErrorAdd(str: string = ''): void {
    // let message = 'خطا در اضافه کردن';
    let message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorAdd');

    if (str && str.length > 0) {
      message = message + ' ' + this.translate.instant('ERRORMESSAGE.TITLE.Error') + ': ' + str;
    }
    this.toastr.error(message, this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeErrorAdd'));
  }
  typeErrorAddSimilar(str: string = ''): void {
    // let message = 'خطا در اضافه کردن مطالب مشابه';
    let message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorAddSimilar');

    if (str && str.length > 0) {
      message = message + ' ' + this.translate.instant('ERRORMESSAGE.TITLE.Error') + ': ' + str;
    }
    this.toastr.error(message, this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeErrorAddSimilar'));
  }
  typeErrorAddOtherInfo(str: string = ''): void {
    // let message = 'خطا در اضافه کردن سایر اطلاعات';
    let message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorAddOtherInfo');

    if (str && str.length > 0) {
      message = message + ' ' + this.translate.instant('ERRORMESSAGE.TITLE.Error') + ': ' + str;
    }
    this.toastr.error(message, this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeErrorAddOtherInfo'));
  }
  typeErrorAddTag(str: string = ''): void {
    // let message = 'خطا در اضافه کردن تگها';
    let message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorAddTag');

    if (str && str.length > 0) {
      message = message + ' ' + this.translate.instant('ERRORMESSAGE.TITLE.Error') + ': ' + str;
    }
    this.toastr.error(message, this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeErrorAddTag'));
  }
  typeErrorRemoveTag(str: string = ''): void {
    // let message = 'خطا در حذف کردن تگها';
    let message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorRemoveTag');

    if (str && str.length > 0) {
      message = message + ' ' + this.translate.instant('ERRORMESSAGE.TITLE.Error') + ': ' + str;
    }
    this.toastr.error(message, this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeErrorRemoveTag'));
  }
  typeErrorRemoveOtherInfo(str: string = ''): void {
    // let message = 'خطا در حذف کردن سایر اطلاعات';
    let message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorRemoveOtherInfo');

    if (str && str.length > 0) {
      message = message + ' ' + this.translate.instant('ERRORMESSAGE.TITLE.Error') + ': ' + str;
    }
    this.toastr.error(message, this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeErrorRemoveOtherInfo'));
  }
  typeErrorRemoveSimilar(str: string = ''): void {
    // let message = 'خطا در حذف کردن اطلاعات مشابه';
    let message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorRemoveSimilar');

    if (str && str.length > 0) {
      message = message + ' ' + this.translate.instant('ERRORMESSAGE.TITLE.Error') + ': ' + str;
    }
    this.toastr.error(message, this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeErrorRemoveSimilar'));
  }
  typeErrorGetCpatcha(str: string = ''): void {
    // let message = 'خطا در ساخت عکس کپچا';
    let message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorGetCpatcha');

    if (str && str.length > 0) {
      message = message + ' ' + this.translate.instant('ERRORMESSAGE.TITLE.Error') + ': ' + str;
    }
    this.toastr.error(message, this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeErrorGetCpatcha'));
  }
  typeErrorAddDuplicate(str: string = ''): void {
    // let message = 'اطلاعات وارد شده تکراری است';
    let message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorAddDuplicate');

    if (str && str.length > 0) {
      message = message + ' ' + this.translate.instant('ERRORMESSAGE.TITLE.Error') + ': ' + str;
    }
    this.toastr.error(message, this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeErrorAddDuplicate'));
  }

  typeErrorRemove(str: string = ''): void {
    // let message = 'خطا در حذف کردن';
    let message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorRemove');

    if (str && str.length > 0) {
      message = message + ' ' + this.translate.instant('ERRORMESSAGE.TITLE.Error') + ': ' + str;
    }
    this.toastr.error(message, this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeErrorRemove'));
  }

  typeErrorEdit(str: string = ''): void {
    // let message = 'خطا در ویرایش کردن';
    let message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorEdit');

    if (str && str.length > 0) {
      message = message + ' ' + this.translate.instant('ERRORMESSAGE.TITLE.Error') + ': ' + str;
    }
    this.toastr.error(message, this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeErrorEdit'));
  }

  typeErrorMove(str: string = ''): void {
    // let message = 'خطا در جابجا کردن';
    let message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorMove');

    if (str && str.length > 0) {
      message = message + ' ' + this.translate.instant('ERRORMESSAGE.TITLE.Error') + ': ' + str;
    }
    this.toastr.error(message, this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeErrorMove'));
  }

  typeErrorLogin(str: string = ''): void {
    let message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorLogin');

    if (str && str.length > 0) {
      message = message + ' ' + this.translate.instant('ERRORMESSAGE.TITLE.Error') + ': ' + str;
    }
    this.toastr.error(message, this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeErrorLogin'));
  }

  typeErrorEditRowIsNull(str: string = ''): void {
    // let message = 'ردیف اطلاعات جهت ویرایش مشخص نیست';
    let message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorEditRowIsNull');

    if (str && str.length > 0) {
      message = message + ' ' + this.translate.instant('ERRORMESSAGE.TITLE.Error') + ': ' + str;
    }
    this.toastr.error(message, this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeErrorEditRowIsNull'));
  }

  typeErrorDeleteRowIsNull(str: string = ''): void {
    // let message = 'ردیف اطلاعات جهت حذف مشخص نیست';
    let message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorDeleteRowIsNull');

    if (str && str.length > 0) {
      message = message + ' ' + this.translate.instant('ERRORMESSAGE.TITLE.Error') + ': ' + str;
    }
    this.toastr.error(message, this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeErrorDeleteRowIsNull'));
  }

  typeErrorAddRowParentIsNull(str: string = ''): void {
    // let message = 'ردیف والد اطلاعات جهت ثبت مشخص نیست';
    let message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorAddRowParentIsNull');

    if (str && str.length > 0) {
      message = message + ' ' + this.translate.instant('ERRORMESSAGE.TITLE.Error') + ': ' + str;
    }
    this.toastr.error(message, this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeErrorAddRowParentIsNull'));
  }
  typeErrorGetPosition(str: string = ''): void {
    let message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorGetPosition');

    if (str && str.length > 0) {
      message = message + ' ' + this.translate.instant('ERRORMESSAGE.TITLE.Error') + ': ' + str;
    }
    this.toastr.error(message, this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeErrorGetPosition'));
  }
  typeErrorLogout(str: string = ''): void {
    // let message = 'برروز خطا در خارج شدن از حساب کاربری';
    let message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorLogout');

    if (str && str.length > 0) {
      message = message + ' ' + this.translate.instant('ERRORMESSAGE.TITLE.Error') + ': ' + str;
    }
    this.toastr.error(message, this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeErrorLogout'));
  }
  typeErrorRegistery(str: string = ''): void {
    // let message = 'برروز خطا در ایجاد حساب کاربری';
    let message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorRegistery');

    if (str && str.length > 0) {
      message = message + ' ' + this.translate.instant('ERRORMESSAGE.TITLE.Error') + ': ' + str;
    }
    this.toastr.error(message, this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeErrorRegistery'));
  }
  typeErrorSelected(str: string = ''): void {
    // let message = 'برروز خطا در انتخاب';
    let message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorSelected');

    if (str && str.length > 0) {
      message = message + ' ' + this.translate.instant('ERRORMESSAGE.TITLE.Error') + ': ' + str;
    }
    this.toastr.error(message, this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeErrorSelected'));
  }
  typeErrorSelectedRow(str: string = ''): void {
    // let message = 'برروز خطا در انتخاب';
    let message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorSelectedRow');

    if (str && str.length > 0) {
      message = message + ' ' + this.translate.instant('ERRORMESSAGE.TITLE.Error') + ': ' + str;
    }
    this.toastr.error(message, this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeErrorSelectedRow'));
  }
  typeErrorMessage(message: string, title: string = 'Error!'): void {

    this.toastr.error(message, this.now() + title);
  }

  typeError(model: any, str: string = ''): void {
    console.log("Error", model);
    let message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeError') + ' ' + str + "\n" + model.errorTypeTitle;
    if (!model) {
      this.toastr.error(message, this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeError'));
      return;
    }
    let errorExceptionResult: ErrorExceptionResultBase;
    if (model.error) {
      errorExceptionResult = model.error;
      if (errorExceptionResult) {
        if (errorExceptionResult.status === 401) {
          message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeError_login') + ' ' + str;

          this.toastr.error(message, this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeError'));
          return;
        }
      }
    }
    if (model.errors) {
      console.log(model.errors);
      message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeError_viewConsoleLog') + ' ' + str;
      this.toastr.error(message, this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeError'));
      return;
    } else if (model && model.errorMessage) {

      message = model.errorMessage + ' ' + str;
      this.toastr.error(message, this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeError'));
    }

    message = (model.message) ? model.message : model.status ? `${model.status} - ${model.statusText}` : 'Server error';
    this.toastr.error(message, this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeError'));

    return;

  }
  typeErrorForNotComplete(str: string = ''): void {
    // let message = 'فرم کامل نیست';
    let message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorForNotComplete');

    if (str && str.length > 0) {
      message = message + ' ' + this.translate.instant('ERRORMESSAGE.TITLE.Error') + ': ' + str;
    }
    this.toastr.error(message, this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeErrorForNotComplete'));
  }

  typeWarningRecordStatusNoAvailable(str: string = ''): void {

    let message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeWarningRecordStatusNoAvailable');

    if (str && str.length > 0) {
      message = message + ' ' + this.translate.instant('ERRORMESSAGE.TITLE.Error') + ': ' + str;
    }
    this.toastr.warning(message, this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeErrorSelected'));
  }
  typeWarningMessage(message: string, title: string = 'Warning!'): void {

    this.toastr.warning(message, this.now() + title);
  }
  typeWarningSelected(str: string = ''): void {
    // let message = 'برروز خطا در انتخاب';
    let message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorSelected');

    if (str && str.length > 0) {
      message = message + ' ' + this.translate.instant('ERRORMESSAGE.TITLE.Error') + ': ' + str;
    }
    this.toastr.warning(message, this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeErrorSelected'));
  }
  typeWarning(str: string = ''): void {
    // let message = 'برروز خطا در انتخاب';
    let message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorSelected');

    if (str && str.length > 0) {
      message = message + ' ' + this.translate.instant('ERRORMESSAGE.TITLE.Error') + ': ' + str;
    }
    this.toastr.warning(message, this.now() + this.translate.instant('ERRORMESSAGE.TITLE.typeErrorSelected'));
  }
}

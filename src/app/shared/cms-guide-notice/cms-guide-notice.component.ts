import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CoreGuideService } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-cms-guide-notice',
  templateUrl: './cms-guide-notice.component.html',
  styleUrls: ["./cms-guide-notice.component.scss"],
})
export class CmsGuideNoticeComponent implements OnInit, OnDestroy {
  static nextId = 0;
  id = ++CmsGuideNoticeComponent.nextId;
  @Input() Identity: number;
  @Input() Key: string;
  @Input() title: string;
  description: string;
  body: string;
  podcast: number;
  podcastSrc: string;
  movie: number;
  movieSrc: string;
  @Input() classes: string;
  @Input() icon: string;
  @Input() svg: string;

  constructor(
    // private activeModal: NgbActiveModal,
    private tokenHelper: TokenHelper,
    private cdr: ChangeDetectorRef,
    private coreGuideService: CoreGuideService,
    private cmsToastrService: CmsToastrService,
    public dialog: MatDialog,
  ) { }
  closeResult = '';
  cmsApiStoreSubscribe: Subscription;
  lang = '';
  ngOnInit(): void {

    this.tokenHelper.getCurrentToken().then((value) => {
      this.lang = value.language;
      this.onGetOne();
    });
    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((next) => {
      this.lang = next.language;
      this.onGetOne();
    });

  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  bodyShow = false;
  onGetOne(): void {
    if (this.Identity > 0) {
      this.coreGuideService.ServiceGetOneById(this.Identity).pipe(
        map(
          (next) => {
            if (next.isSuccess) {

              switch (this.lang) {
                case 'fa': {
                  this.title = next.item.titleFa;
                  this.description = next.item.descriptionFa;
                  this.body = next.item.bodyFa;
                  this.podcast = next.item.linkFilePodcastIdFa;
                  this.movie = next.item.linkFileMovieIdFa;
                  this.podcastSrc = next.item.linkFilePodcastIdFaSrc;
                  this.movieSrc = next.item.linkFileMovieIdFaSrc;
                  break;
                }
                case 'en': {
                  this.title = next.item.titleEn;
                  this.description = next.item.descriptionEn;
                  this.body = next.item.bodyEn;
                  this.podcast = next.item.linkFilePodcastIdEn;
                  this.movie = next.item.linkFileMovieIdEn;
                  this.podcastSrc = next.item.linkFilePodcastIdEnSrc;
                  this.movieSrc = next.item.linkFileMovieIdEnSrc;
                  break;
                }
                case 'ar': {
                  this.title = next.item.titleAr;
                  this.description = next.item.descriptionAr;
                  this.body = next.item.bodyAr;
                  this.podcast = next.item.linkFilePodcastIdAr;
                  this.movie = next.item.linkFileMovieIdAr;
                  this.podcastSrc = next.item.linkFilePodcastIdArSrc;
                  this.movieSrc = next.item.linkFileMovieIdArSrc;
                  break;
                }
                case 'de': {
                  this.title = next.item.titleDe;
                  this.description = next.item.descriptionDe;
                  this.body = next.item.bodyDe;
                  this.podcast = next.item.linkFilePodcastIdDe;
                  this.movie = next.item.linkFileMovieIdDe;
                  this.podcastSrc = next.item.linkFilePodcastIdDeSrc;
                  this.movieSrc = next.item.linkFileMovieIdDeSrc;
                  break;
                }
                default: {
                  this.title = next.item.titleFa;
                  this.description = next.item.descriptionFa;
                  this.body = next.item.bodyFa;
                  this.podcast = next.item.linkFilePodcastIdFa;
                  this.movie = next.item.linkFileMovieIdFa;
                  this.podcastSrc = next.item.linkFilePodcastIdFaSrc;
                  this.movieSrc = next.item.linkFileMovieIdFaSrc;
                  break;
                }
              }
            } else if (!environment.production) {
              // console.log(next.errorMessage, this.Key);
              this.cmsToastrService.typeWarningMessage(next.errorMessage, this.Key + ' راهنما یافت نشد ');
            }
          },
          (error) => {
            this.cmsToastrService.typeError(error);
          })
      ).toPromise();
    } else if (this.Key && this.Key.length > 0) {
      this.coreGuideService.ServiceGetOneByKey(this.Key).pipe(
        map(
          (next) => {
            if (next.isSuccess) {

              switch (this.lang) {
                case 'fa': {
                  this.title = next.item.titleFa;
                  this.description = next.item.descriptionFa;
                  this.body = next.item.bodyFa;
                  this.podcast = next.item.linkFilePodcastIdFa;
                  this.movie = next.item.linkFileMovieIdFa;
                  this.podcastSrc = next.item.linkFilePodcastIdFaSrc;
                  this.movieSrc = next.item.linkFileMovieIdFaSrc;
                  break;
                }
                case 'en': {
                  this.title = next.item.titleEn;
                  this.description = next.item.descriptionEn;
                  this.body = next.item.bodyEn;
                  this.podcast = next.item.linkFilePodcastIdEn;
                  this.movie = next.item.linkFileMovieIdEn;
                  this.podcastSrc = next.item.linkFilePodcastIdEnSrc;
                  this.movieSrc = next.item.linkFileMovieIdEnSrc;
                  break;
                }
                case 'ar': {
                  this.title = next.item.titleAr;
                  this.description = next.item.descriptionAr;
                  this.body = next.item.bodyAr;
                  this.podcast = next.item.linkFilePodcastIdAr;
                  this.movie = next.item.linkFileMovieIdAr;
                  this.podcastSrc = next.item.linkFilePodcastIdArSrc;
                  this.movieSrc = next.item.linkFileMovieIdArSrc;
                  break;
                }
                case 'de': {
                  this.title = next.item.titleDe;
                  this.description = next.item.descriptionDe;
                  this.body = next.item.bodyDe;
                  this.podcast = next.item.linkFilePodcastIdDe;
                  this.movie = next.item.linkFileMovieIdDe;
                  this.podcastSrc = next.item.linkFilePodcastIdDeSrc;
                  this.movieSrc = next.item.linkFileMovieIdDeSrc;
                  break;
                }
                default: {
                  this.title = next.item.titleFa;
                  this.description = next.item.descriptionFa;
                  this.body = next.item.bodyFa;
                  this.podcast = next.item.linkFilePodcastIdFa;
                  this.movie = next.item.linkFileMovieIdFa;
                  this.podcastSrc = next.item.linkFilePodcastIdFaSrc;
                  this.movieSrc = next.item.linkFileMovieIdFaSrc;
                  break;
                }
              }

            } else if (!environment.production) {
              // console.log(next.errorMessage, this.Key);
              this.cmsToastrService.typeWarningMessage(next.errorMessage, this.Key + ' راهنما یافت نشد ');
            }
          },
          (error) => {
            this.cmsToastrService.typeError(error);
          })
      ).toPromise();

    }
  }
  onActionCopyHeaderKey(keyTemplate: any, event?: MouseEvent): void {
    if (event?.ctrlKey && event?.altKey) {
      const dialogRef = this.dialog.open(keyTemplate, {
        width: '15%',
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.dialogChangedDate) {
        }
      });
    }
  }
  onActionCopied(): void {
    this.cmsToastrService.typeSuccessCopedToClipboard();
  }
  onActionBottunClick() {
    this.bodyShow = true;
    this.cdr.detectChanges();
  }
  onActionCloseBottunClick() {
    this.bodyShow = false;
    this.cdr.detectChanges();
  }
}

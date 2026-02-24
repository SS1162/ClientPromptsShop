import { Component, OnInit, inject, DestroyRef, ChangeDetectorRef,  OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageService } from 'primeng/api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PlatformServise } from '../../Servises/PlatformServise/platform-servise';
import { SiteTypeService } from '../../Servises/SiteTypeService/site-type.service';
import { BasicSiteService } from '../../Servises/BasicSiteServise/basic-site.service';
import { AddBasicSiteModel } from '../../Models/AddBasicSiteModel';
import { PlatformsModel } from '../../Models/PlatformsModel';
import { SiteTypeModel } from '../../Models/SiteTypeModel';
import { UserServise } from '../../Servises/UserServise/User-servise';
import { UserModel } from '../../Models/UserModel';
import { Router } from '@angular/router';
import { UpdateUserModel } from '../../Models/UpdateUserModel';
import { UpdateBasicSiteModel } from '../../Models/UpdateBasicSiteModel';
import { SelectModule } from 'primeng/select';
import { GeminiServise } from '../../Servises/geminiServise/gemini-servise';
import { geminiPromptModel } from '../../Models/geminiPromptModel';

@Component({
  selector: 'app-basic-site',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ToastModule,
    InputTextModule,
    ButtonModule,
    FloatLabelModule,
    SelectModule
  ],
  templateUrl: './basic-site.html',
  styleUrl: './basic-site.scss',
  providers: [MessageService],
})
export class BasicSite implements OnInit {
  private platformService = inject(PlatformServise);
  private siteTypeService = inject(SiteTypeService);
  private basicSiteService = inject(BasicSiteService);
  private messageService = inject(MessageService);
  private destroyRef = inject(DestroyRef);
  private userService = inject(UserServise);
  private router = inject(Router)
  formData: AddBasicSiteModel = {
    siteName: '',
    userDescreption: undefined,
    siteTypeID: 0,
    platformID: 0,
  };

  platforms: PlatformsModel[] = [];
  siteTypes: SiteTypeModel[] = [];
  isSubmitting = false;
  isLoading = false;
  deletePrompt: boolean = false;
  selectedSiteTypeDescription: string = '';
  user?: UserModel

  ngOnInit(): void {
    this.loadPlatformsAndSiteTypes();
    this.loadUser();
  }
  loadUser() {
    this.userService.user$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (user) => {
        this.user = user || undefined;
        if (this.user?.basicID) {
          this.basicSiteService.getBasicSites(this.user.basicID)
        }
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load user data' });
      }
    });

    this.basicSiteService.basicSites$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        this.formData.siteName = data?.siteName || '';
        if (data?.platformID) {
          this.formData.platformID = data?.platformID
        }
        if (data?.siteTypeID) {
          this.formData.siteTypeID = data?.siteTypeID
        }

        if (data?.geminiPromptId) {
          this.formData.userDescreption = data.geminiPromptId;
          this.geminiServise.getPrompt(data.geminiPromptId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (response) => {
              this.prompt!.promptId = (response.body as any).promptId;
              this.prompt!.prompt = (response.body as any).prompt;
              this.aiData = this.prompt!.prompt;
              this.isSubmitted = true;
              this.deletePrompt = false;
            }
          });
        } else {
          this.formData.userDescreption = undefined;
        }
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load basic site data' });
      }
    })
  }
  loadPlatformsAndSiteTypes(): void {
    this.isLoading = true;

    // Subscribe to platforms
    this.platformService.platforms$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (platforms) => {
          this.platforms = platforms || [];
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load platforms' });
        }
      });


    // Subscribe to site types
    this.siteTypeService.siteTypes$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (siteTypes) => {
          this.siteTypes = siteTypes || [];
          this.isLoading = false;
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load site types' });
        }
      });

    // Subscribe to platform errors
    this.platformService.error$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (error) => {
          if (error) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to load platforms: ',
            });
          }
        },
        error: (err) => {
          console.log(err);
        }
      });

    // Subscribe to site type errors
    this.siteTypeService.error$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (error) => {
          if (error) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to load site types: ',
            });
            this.isLoading = false;
          }
        },
        error: (err) => {
          console.log(err);
        }
      });

    // Load data from services
    this.platformService.getPlatforms();
    this.siteTypeService.getSiteTypes();
  }

  onPlatformChange(): void {
    const selectedPlatform = this.platforms.find(p => p.platformID === this.formData.platformID);

  }

  onSiteTypeChange(): void {
    const selectedSiteType = this.siteTypes.find(s => s.siteTypeID === this.formData.siteTypeID);
    if (selectedSiteType) {
      this.selectedSiteTypeDescription = selectedSiteType.siteTypeDescription;
    }
  }

  handleSubmit(): void {
    if (!this.user) {
      this.router.navigate(['/login']);
      return;
    }
    if (!this.formData.siteName || !this.formData.platformID || (!this.formData.siteTypeID && !this.aiData && this.aiData.trim() === "")) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please fill in all required fields',
      });
      return;
    }

    if (this.formData.siteTypeID && this.aiData.trim() !== "") {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'you can\'t fill the site type and the ai description at the same time, please choose one of them',
      });
      return;
    }

    this.isSubmitting = true;

    if (!this.user?.basicID) {
      this.basicSiteService.addBasicSite(this.formData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.isSubmitting = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Basic Site "${result.siteName}" created successfully!`,
          });

            this.user!.basicID = result.basicSiteID;
            const UpdaterUser: UpdateUserModel = {
              userName: this.user!.userName,
              basicID: this.user!.basicID,
              userID: this.user!.userID,
              firstName: this.user!.firstName,
              lastName: this.user!.lastName,
            };
            this.userService.UpdaterUser(UpdaterUser, UpdaterUser.userID);
          },
          error: (error) => {
            this.isSubmitting = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to create basic site: ',
            });
          },
        });
    }
    else {
      const updateData: UpdateBasicSiteModel = {
        basicSiteID: this.user!.basicID!,
        siteName: this.formData.siteName,
        userDescreption: this.prompt?.promptId || undefined,
        siteTypeID: this.formData.siteTypeID,
        platformID: this.formData.platformID,
      };
      this.basicSiteService.updateBasicSite(updateData)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.deletePrompt = false;
            this.isSubmitting = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `Basic Site "${this.formData.siteName}" updated successfully!`,
            });
          },
          error: () => {
            this.isSubmitting = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to update basic site',
            });
          },
        });
    }


  }





  aiData: string = '';
  isSubmitted: boolean = false;
  prompt: geminiPromptModel | null = new geminiPromptModel();
  geminiServise: GeminiServise = inject(GeminiServise)
  private cdr = inject(ChangeDetectorRef);

  handleAiSubmit() {
      if (!this.user) {
      this.router.navigate(['/login'])
    }
    if (this.aiData && this.aiData.trim() !== '') {
      this.isSubmitted = true;
      this.geminiServise.AddBasicSitePrompt(this.aiData).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (response) => {
          console.log('AI Response:', response.body);
          this.prompt!.prompt = (response.body as any).prompt
          this.prompt!.promptId = (response.body as any).promptId
          this.aiData = this.prompt!.prompt;
          console.log(this.aiData)
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create basic site: ' + error.message,
          });
        }

      }
      );
    }
  }
  handleEdit() {
    this.geminiServise.updateBasicSitePrompt(this.prompt!.promptId, this.aiData).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        console.log('AI Response:', response.body);
        if (this.prompt!.prompt === response.body!.prompt) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create basic site: ',
          });
        }
        else {
          this.prompt = response.body
          this.aiData = (response.body as any).prompt;
          this.cdr.detectChanges();
        }

      },
      error: (error) => {
        this.isSubmitted = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update basic site prompt: ',
        });
      }
    });
  }


  handleDelete() {
    this.isSubmitted = false;
    this.aiData = '';
    this.geminiServise.deletePrompt(this.prompt!.promptId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.prompt = new geminiPromptModel();
      },
      error: (error) => {
        console.log("it not deleted" + this.prompt!.promptId)
      }
    });
  }
}





import { Component, OnInit, inject, DestroyRef, ChangeDetectorRef } from '@angular/core';
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
    userDescreption: '',
    siteTypeID: 0,
    platformID: 0,
  };

  platforms: PlatformsModel[] = [];
  siteTypes: SiteTypeModel[] = [];
  isSubmitting = false;
  isLoading = false;
  selectedSiteTypeDescription: string = '';
  user?: UserModel
  ngOnInit(): void {
    this.loadPlatformsAndSiteTypes();
    this.loadUser();
  }
  loadUser() {
    this.userService.user$.subscribe({
      next: (user) => {
        this.user = user || undefined;
      },
    });
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
      });


    // Subscribe to site types
    this.siteTypeService.siteTypes$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (siteTypes) => {
          this.siteTypes = siteTypes || [];
          this.isLoading = false;
        },
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
      });

    // Load data from services
    this.platformService.getPlatforms();
    this.siteTypeService.getSiteTypes();
  }

  onPlatformChange(): void {
    const selectedPlatform = this.platforms.find(p => p.platformID === this.formData.platformID);
    if (selectedPlatform) {
      // Platform selected
    }
  }

  onSiteTypeChange(): void {
    const selectedSiteType = this.siteTypes.find(s => s.siteTypeID === this.formData.siteTypeID);
    if (selectedSiteType) {
      this.selectedSiteTypeDescription = selectedSiteType.siteTypeDescription;
      this.formData.userDescreption = selectedSiteType.siteTypeDescription;
    }
  }

  handleSubmit(): void {
    if (!this.user) {
      this.router.navigate(['/login'])
    }
    if (!this.formData.siteName || !this.formData.platformID || (!this.formData.siteTypeID&&this.aiData.trim()==="")) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please fill in all required fields',
      });
      return;
    }

    if(this.formData.siteTypeID&&this.aiData.trim()!=="")
    {
        this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'you can\'t fill the site type and the ai description at the same time, please choose one of them',
      });
      return;
    }

    this.isSubmitting = true;

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

          // Reset form
          this.formData = {
            siteName: '',
            userDescreption: '',
            siteTypeID: 0,
            platformID: 0,
          };
          this.selectedSiteTypeDescription = '';
          this.user!.BasicID = result.basicSiteID
          const UpdaterUser: UpdateUserModel = {
            userName: this.user!.userName,
            BasicID: this.user!.BasicID,
            userID: this.user!.userID,
            firstName: this.user!.firstName,
            lastName: this.user!.lastName,
          }
          this.userService.UpdaterUser(UpdaterUser, UpdaterUser.userID)
        },
        error: (error) => {
          this.isSubmitting = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create basic site: ' + error.message,
          });
        },
      });
  }





  aiData: string = '';
  isSubmitted: boolean = false;
  prompt: geminiPromptModel | null = new geminiPromptModel();
  geminiServise: GeminiServise = inject(GeminiServise)
  private cdr = inject(ChangeDetectorRef);

  handleAiSubmit() {
    if (this.aiData && this.aiData.trim() !== '') {
      this.isSubmitted = true;
      this.geminiServise.AddBasicSitePrompt(this.aiData).subscribe({
        next: (response) => {
          console.log('AI Response:', response.body);
          this.prompt!.Prompt = (response.body as any).prompt
         this.prompt!.PromptId = (response.body as any).promptId
          this.aiData = this.prompt!.Prompt;
          console.log(this.aiData)
          this.cdr.detectChanges();
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
    this.geminiServise.updateBasicSitePrompt(this.prompt!.PromptId, this.aiData).subscribe({
      next: (response) => {
        console.log('AI Response:', response.body);
        if (this.prompt!.Prompt === response.body!.Prompt) {
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
    this.geminiServise.deletePrompt(this.prompt!.PromptId).subscribe({
      next: () => {
        this.prompt = null;   
      },
      error: (error) => {
    console.log("it not deleted"+this.prompt!.PromptId)
      }
    });
  }
}





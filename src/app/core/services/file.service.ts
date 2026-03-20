import { inject, Injectable } from "@angular/core";
import { FileResponse } from "../models/file-response.model";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";

@Injectable({
    providedIn: "root"
})
export class FileService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = `${environment.apiUrl}/api/file`;

    upload(blob: Blob): Observable<FileResponse> {
        const formData = new FormData();
        formData.append('file', blob);

        return this.http.post<FileResponse>(`${this.baseUrl}/upload`, formData);
    }

    async compressImage(file: File, maxWidth = 800): Promise<Blob> {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(new Blob([file]));
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const scale = maxWidth / img.width;
                    canvas.width = maxWidth;
                    canvas.height = img.height * scale;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
                    canvas.toBlob((blob) => resolve(blob!), 'image/webp', 0.8);
                }
            }
        });
    }
}
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker?url";

const resumeFileName: string = "SetoKadenResumeJan2025";

export async function createExperiencePopup(): Promise<HTMLElement> {
    const mainContent: string = await fetch('/pages/experience.html')
        .then(res => res.text())
        .then(text => text.replace("{{RESUME_FILE}}", resumeFileName));
    
    const wrapper: HTMLDivElement = document.createElement('div');
    wrapper.id = "aboutme";
    wrapper.innerHTML = mainContent;

    GlobalWorkerOptions.workerSrc = pdfjsWorker;
    const url = `/files/${resumeFileName}.pdf`;
    const container = wrapper.querySelector("#pdf-container");

    //PDF preview setup
    getDocument(url).promise.then((pdf) => {
        for (let i = 1; i <= pdf.numPages; i++) {
            pdf.getPage(i).then((page) => {
                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");
                if (context) {
                    const viewport = page.getViewport({ scale: 1.5 });
            
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;
                    canvas.style.marginBottom = "1rem";
            
                    page.render({ canvasContext: context, viewport: viewport }).promise.then(() => {
                        container?.appendChild(canvas);
                    });
                } else {
                    console.error("Failed to get canvas 2d context");
                }
            })
            .catch(e => {
                console.log("Error loading pdf: ", e);
            });
        }
    });

    // Closing the wrapper
    setTimeout(() => {
        window.addEventListener('click', (evt) => {
            const target = evt.target as HTMLElement;
            if (target.closest('.resume-popup-overlay') && !target.closest('a')) {
                wrapper.remove();
            }
        });
    });

    return wrapper;
}
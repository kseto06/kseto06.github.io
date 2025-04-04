export async function createAboutMePopup(): Promise<HTMLElement> {
    const mainContent: string = await fetch('/pages/aboutme.html').then(res => res.text());

    const wrapper: HTMLDivElement = document.createElement('div');
    wrapper.id = "aboutme";
    wrapper.innerHTML = mainContent;

    // Closing the wrapper
    setTimeout(() => {
        window.addEventListener(
        'click',
        (evt) => {
            const target = evt.target as HTMLElement;
            if (!target.closest('.popup-wrapper')) {
                wrapper.remove();
            }
        },
        );

        wrapper.querySelector('.popup-close-wrapper')?.addEventListener('click', () => {
            wrapper.remove();
        });
    });

    return wrapper;
}

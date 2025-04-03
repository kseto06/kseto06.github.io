const mainContent: string = `
    <link rel="stylesheet" href="/styles/projects.css" />
    <div class="popup-wrapper">
    <div class="popup-content">
        <h2 class="popup-title">Projects</h2>

        <div class="project" name="aegis">
            <img src="/images/aegis.png" alt="Aegis"/>
            <div class="project-content">
                <div class="project-title">Right-Hook Collision Detection and Prevention Systems (Praxis II)</div>
                <div class="project-desc">Leveraging computer vision and lights to develop a cyclist detection system that mitigates right-hook collisions in Toronto.</div>
            </div>
            <div class="project-date">Jan 2025 - Apr 2025</div>
        </div>

        <div class="project" name="aisquared">
            <img src="/images/aisquared.png" alt="UTMIST AI^2 Tournament" />
            <div class="project-content">
                <div class="project-title">UTMIST AI^2 Tournament</div>
                <div class="project-desc">The official, first-ever tournament launched by UTMIST focused on Reinforcement Learning.</div>
            </div>
            <div class="project-date">Nov 2024 - Mar 2025</div>
        </div>

        <div class="project">
            <img src="/images/innerworlds.png" alt="InnerWorlds" />
            <div class="project-content">
                <div class="project-title">Inner Worlds</div>
                <div class="project-desc">Unity Framework to turn simple text prompts into immersive & explorable 3D environments by leveraging LLMs, Generative AI, and spatial reasoning.</div>
            </div>
            <div class="project-date">Mar 2025</div>
        </div>

        <div class="project">
            <img src="/images/otakunet.png" alt="OtakuNet" />
            <div class="project-content">
                <div class="project-title">OtakuNet</div>
                <div class="project-desc">Anime app that uses content-based filtering trained on a neural network framework made from scratch to recommend different animes based on what genres the user likes.</div>
            </div>
            <div class="project-date">Sep 2024 - Oct 2024</div>
        </div>

        <div class="popup-close-wrapper">
            <div class="popup-close">click anywhere to close</div>
        </div>

    </div>
`;

export function createProjectPopup(): HTMLElement {
    const wrapper: HTMLDivElement = document.createElement('div');
    wrapper.id = "projects";
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

    wrapper.querySelector('.popup-wrapper')?.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        const projectElement = target.closest('.project');
        if (projectElement) {
            event.stopPropagation(); //Pause to allow clicking into project
            const projectId = projectElement.getAttribute('name');
            const popupContent = wrapper.querySelector('.popup-content') as HTMLElement | null;
            if (popupContent) {
                if (popupContent instanceof HTMLElement) {
                    updatePopupContent(wrapper, popupContent, projectId);
                }
            }
        }
    });

    return wrapper;
}

function updatePopupContent(wrapper: HTMLElement, popupContent: HTMLElement, projectId: string | null): void {
    //Project HTMLs
    if (projectId === 'aisquared') {
        popupContent.innerHTML = `
            <h2 class="popup-title">UTMIST AI^2 Tournament</h2>
                <p>Details about the tournament...</p>
        `;
    } else if (projectId === 'aegis') {
        popupContent.innerHTML = `
            <h2 class="popup-title">Aegis</h2>

            <h3 style="display: inline-block; margin-right: 10px; margin-bottom: 0;">
                A Design for Right-Hook Collision Detection and Prevention Systems for Praxis II Design Project
            </h3><h5 style="display: inline-block; color: #3b3b3b; margin-bottom: 0;">
                Kaden Seto, Kimmy Tran, Oscar Liang, Sarah Wang
            </h5>

            <br>

            <a href="https://github.com/kseto06/Aegis" target="_blank" style="display: inline-block; margin-right: 10px; margin-bottom: 0;">
                <span style="display: inline; margin: 0;">Github</span>
            </a><a href="https://docs.google.com/document/d/1bZuDZQIqMYzXFShAqbd3qogVS45IHW4aUAbIcS_Sjrw/edit?usp=sharing" 
                target="_blank" 
                style="display: inline-block;">
                <span style="display: inline; margin: 0;">Request for Proposal (RFP)</span>
            </a>

            <h3>Summary: </h3>
            
            <p>
                For my Praxis II design project, my Praxis team (me, Kimmy, Oscar, and Sarah) teamed up to address the issue of
                right-hooking in the City of Toronto. Right-hooking is a common type of cyclist incident that occurs in Toronto and 
                is one of the major causes of the many yearly cyclist injuries and deaths. Right-hooking occurs when a vehicle fails to 
                check a passing cyclist in their blindspot while making a right turn, resulting in the vehicle colliding with the cyclist.
                As avid cyclists, my team and I are always worried about the safety of Toronto cyclists and we wanted to tackle this opportunity.
                <br><br>
                <!-- ADD MORE STUFF ON ENG DESIGN AND THE SYSTEM LATER -->
            </p>

            <div class="popup-close-wrapper">
                <div class="popup-close">click anywhere to close</div>
            </div>
        `;
    }

    //Attach back 'click anywhere to close' wrapper
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

    const backWrapper = document.createElement('div');
    backWrapper.className = 'popup-back-wrapper';
    backWrapper.innerHTML = `<div class="popup-close">← back</div>`;

    const popupWrapper = wrapper.querySelector('.popup-wrapper');
    popupWrapper?.appendChild(backWrapper);

    // Attach event listener for the back button
    backWrapper.querySelector('.popup-close')?.addEventListener('click', (e) => {
        e.stopPropagation();
        wrapper.innerHTML = mainContent;

        //Attach back 'click anywhere to close' wrapper
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

        //Reconstruct the projects
        wrapper.querySelector('.popup-wrapper')?.addEventListener('click', (event) => {
            const target = event.target as HTMLElement;
            const projectElement = target.closest('.project');
            if (projectElement) {
                event.stopPropagation();
                const projectId = projectElement.getAttribute('name');
                const popupContent = wrapper.querySelector('.popup-content') as HTMLElement | null;

                if (popupContent instanceof HTMLElement) {
                    updatePopupContent(wrapper, popupContent, projectId);
                }
            }
        });
    });
}
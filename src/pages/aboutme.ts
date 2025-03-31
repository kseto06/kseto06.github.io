const mainContent: string = `
    <style>
    @font-face {
        font-family: 'MaruMinya';
        src: url('/fonts/MaruMinya.ttf') format('truetype');
        font-weight: normal;
        font-style: normal;
    }

    .popup-wrapper {
        font-family: 'MaruMinya';
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 90%;
        max-width: 800px;
        max-height: 80vh;
        overflow-y: auto;
        padding: 2rem;
        border-radius: 0.5rem;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
        background-color: white;
        color: black;
        z-index: 9999;
    }

    .popup-bg {
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        background-image: url('/images/calligraphy.jpg');
        background-size: cover;
        background-position: center;
        opacity: 0.15;
        border-radius: 0.5rem;
        z-index: 0;
    }

    .popup-content {
        position: relative;
        z-index: 1;
        min-height: 625px; /* Adjust this as needed */
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .popup-title {
        font-size: 1.75rem;
        font-weight: 600;
        margin-bottom: 1.5rem;
    }

    .aboutme {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 1.5rem;
        padding: 1rem 0;
    }

    .aboutme img {
        width: 200px;
        height: 200px;
        object-fit: cover;
        border-radius: 50%;
        margin-top: 1rem;
    }

    .content {
        flex-grow: 0.5;
    }

    .title {
        font-family: 'MaruMinya', sans-serif;
        font-size: 1.5rem;
        font-weight: bold;
    }

    .desc {
        font-size: 1.1rem;
        color: #444;
        line-height: 1.2;
    }

    .links {
        font-size: 1.1rem;
        word-spacing: 4ch;
        align-items: center;
        text-align: center;
    }

    .links a {
        text-decoration: none;
    }

    .popup-close {
        font-size: 0.75rem;
        color: #666;
        margin-top: 1.5rem;
        text-align: center;
        cursor: pointer;
    }
    </style>

    <div class="popup-wrapper">
    <div class="popup-bg"></div>
    <div class="popup-content">
        <h2 class="popup-title">About Me</h2>

        <div class="aboutme" name="About Me">
            <div class="content">
                <div class="desc">
                    I'm a first-year Engineering Science student at University of Toronto. 
                    I'm a creative programmer with a passion for exploring computer science & programming, and I'm super passionate about machine learning and AI. 
                    I'm currently a Reinforcement Learning Academic Lead Developer in UofT's Machine Intelligence Team (UTMIST), 
                    <a href="https://utmist.gitlab.io/" target="_blank">UofT's largest undergraduate machine learning team</a>, 
                    where I led a development team to develop 
                    <a href="https://colab.research.google.com/drive/1V184vtHSagN13L0SbWGmnY-jCDvIefmm?usp=sharing" target="_blank">UTMIST's first-ever tournament</a> 
                    and subsequently produced a 
                    <a href="https://drive.google.com/file/d/1G0hatGPBXvh2j5byjfrqKBthknNOt5sp/view?usp=sharing" target="_blank">technical paper</a>, submitted to CUCAI & IEEE. 
                    Previously, I served as the Lead Programmer for my 
                    <a href="https://titansrobotics.odoo.com/" target="_blank">high school's Robotics Team</a> 
                    and as a Backend Developer for my 
                    <a href="https://app.staugustinechs.ca/" target="_blank">high school's App Development Team</a>.
                </div>
            </div>

            <img src="/images/personal-picture.png" alt="About Me"/>

            <div class="links">
                <a href="https://www.linkedin.com/in/kaden-seto/" target="_blank">
                    <img src="/images/logos/linkedin.png" alt="linkedin" style="width: 48px; height: 48px;"/>
                </a>
                <a href="https://github.com/kseto06" target="_blank">
                    <img src="/images/logos/github.png" alt="github" style="width: 34px; height: 34px; position: relative; top: -8px;"/>
                </a>  
                <a href="mailto:kaden.seto@mail.utoronto.ca" target="_blank">
                    <img src="/images/logos/email.png" alt="email" style="width: 48px; height: 48px;"/>
                </a>
                <a href="https://github.com/kseto06/website" target="_blank">
                    <img src="/images/logos/div.png" alt="website" style="width: 48px; height: 48px; position: relative; left: -7px;"/>
                </a>
            </div>
        </div>


        <div class="popup-close">click anywhere to close</div>
    </div>
`;

export function createAboutMePopup(): HTMLElement {
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
    });

    return wrapper;
}

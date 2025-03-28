export function createProjectPopup(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.id = 'projects';
    wrapper.style.position = 'fixed';
    wrapper.style.top = '50%';
    wrapper.style.left = '50%';
    wrapper.style.transform = 'translate(-50%, -50%)';
    wrapper.style.backgroundColor = 'white';
    wrapper.style.padding = '2rem';
    wrapper.style.color = 'black';
    wrapper.style.zIndex = '9999';
    wrapper.style.border = '2px solid black';
    wrapper.textContent = 'POPUP VISIBLE TEST';

    wrapper.className = `
      fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
      bg-white text-black w-[90%] max-w-3xl p-8 rounded-lg shadow-2xl 
      z-[999] max-h-[80vh] overflow-y-auto
    `;
  
    wrapper.innerHTML = `
      <h2 class="text-2xl font-semibold mb-6">Recent Projects</h2>
      <div class="flex flex-col gap-6">
        <div class="flex items-start gap-4">
          <img src="/images/project1.jpg" alt="Aegis" class="w-24 h-24 object-cover rounded-md" />
          <div>
            <h3 class="text-lg font-bold">Aegis</h3>
            <p class="text-sm text-gray-600">Short description of this project goes here.</p>
            <p class="text-xs text-gray-400 mt-1">March 28, 2025</p>
          </div>
        </div>
      </div>
      <div class="text-center text-xs text-gray-500 mt-6 cursor-pointer close">
        click anywhere to close
      </div>
    `;
  
    // Close logic
    wrapper.querySelector('.close')?.addEventListener('click', () => {
        wrapper.remove();
    });
  
    // Optional: click outside to close
    setTimeout(() => {
        window.addEventListener(
            'click',
            (e) => {
            if (!wrapper.contains(e.target as Node)) {
                wrapper.remove();
            }
            },
            { once: true }
        );
    });
  
    return wrapper;
}
  

/* ===== Image Library - Add your images here ===== */
/* The rotator will automatically detect and use however many images are in each array */
const imageLibrary = {
  general: [
    'images/sample1.jpg',
    'images/sample2.jpg',
    'images/sample3.jpg',
    'images/sample4.jpg',
    'images/sample5.jpg',
    'images/sample6.jpg',
    'images/sample7.jpg',
    'images/sample8.jpg',
    'images/sample9.jpg',
    'images/sample10.jpg',
    // Add more as needed
  ],
  residential: [
    'images/residential1.jpg',
    'images/residential2.jpg',
    'images/residential3.jpg',
    'images/residential4.jpg',
    'images/residential5.jpg',
    'images/residential6.jpg',
    'images/residential7.jpg',
    'images/residential8.jpg',
    'images/residential9.jpg',
    'images/residential10.jpg',
    'images/residential11.jpg',
    'images/residential12.jpg',
    // Add more as needed
  ],
  commercial: [
    'images/commercial1.jpg',
    'images/commercial2.jpg',
    'images/commercial3.jpg',
    'images/commercial4.jpg',
    'images/commercial5.jpg',
    'images/commercial6.jpg',
    'images/commercial7.jpg',
    'images/commercial8.jpg',
    'images/commercial9.jpg',
    'images/commercial10.jpg',
    // Add more as needed
  ]
};


/* ===== Auto-Rotating Gallery ===== */
const galleryRotator = {
  currentIndex: {},
  rotationIntervals: {},
  
  initialize() {
    document.querySelectorAll('[data-gallery]').forEach(gallery => {
      const type = gallery.dataset.gallery;
      const images = imageLibrary[type] || [];
      if (images.length === 0) return;
      
      this.currentIndex[type] = 0;
      this.updateGallery(gallery, type, images);
      
      // Auto-rotate every 5 seconds
      this.rotationIntervals[type] = setInterval(() => {
        this.currentIndex[type] = (this.currentIndex[type] + 1) % images.length;
        this.updateGallery(gallery, type, images);
      }, 5000);
    });
  },
  
  updateGallery(gallery, type, images) {
    const sliders = gallery.querySelectorAll('[data-slider-type="' + type + '"]');
    sliders.forEach(slider => {
      const index = this.currentIndex[type];
      slider.src = images[index];
      slider.alt = `${type.charAt(0).toUpperCase() + type.slice(1)} project ${index + 1}`;
    });
  }
};

/* ===== Scroll Reveal for Services buttons ===== */
document.addEventListener('DOMContentLoaded', () => {
  const serviceButtons = document.querySelectorAll('.service-button');
  const reveal = () => {
    serviceButtons.forEach(btn => {
      const rect = btn.getBoundingClientRect();
      if (rect.top < window.innerHeight - 120) {
        btn.classList.add('revealed');
      }
    });
  };
  window.addEventListener('scroll', reveal);
  reveal();
  
  // Initialize auto-rotating galleries
  galleryRotator.initialize();

  /* ===== Schedule form logic (used on schedule.html) ===== */
  const form = document.getElementById('estimateForm');
  if (form) {
    const projectType = document.getElementById('projectType');
    const areaType = document.getElementById('areaType');
    const exteriorCommercialDesc = document.getElementById('exteriorCommercialDesc');
    const exteriorResidentialColors = document.getElementById('exteriorResidentialColors');
    const interiorCommercialDesc = document.getElementById('interiorCommercialDesc');
    const interiorResidentialSurfaces = document.getElementById('interiorResidentialSurfaces');
    const dynamicConditionContainer = document.getElementById('dynamicConditionContainer');

    const show = el => el && (el.style.display = 'block');
    const hide = el => el && (el.style.display = 'none');

    const updateVisibility = () => {
      hide(exteriorCommercialDesc);
      hide(exteriorResidentialColors);
      hide(interiorCommercialDesc);
      hide(interiorResidentialSurfaces);
      dynamicConditionContainer.innerHTML = '';

      const type = projectType?.value;
      const area = areaType?.value;

      if (area === 'Exterior' && type === 'Commercial') show(exteriorCommercialDesc);
      if (area === 'Exterior' && type === 'Residential') show(exteriorResidentialColors);
      if (area === 'Interior' && type === 'Commercial') show(interiorCommercialDesc);
      if (area === 'Interior' && type === 'Residential') show(interiorResidentialSurfaces);
    };

    projectType?.addEventListener('change', updateVisibility);
    areaType?.addEventListener('change', updateVisibility);

    // For interior residential: build condition questions per selected surface.
    const surfacesCheckboxes = document.querySelectorAll('input[name="surfaces"]');
    surfacesCheckboxes.forEach(cb => {
      cb.addEventListener('change', () => {
        dynamicConditionContainer.innerHTML = '';
        const selected = Array.from(surfacesCheckboxes).filter(x => x.checked).map(x => x.value);
        selected.forEach(surface => {
          const block = document.createElement('div');
          block.className = 'condition-block';
          block.style.margin = '10px 0';
          block.innerHTML = `
            <label><strong>${surface} condition (1=Poor, 5=Basically Perfect):</strong></label><br/>
            <select name="condition_${surface}">
              <option value="1">1 - Poor</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5 - Basically perfect</option>
            </select>
          `;
          dynamicConditionContainer.appendChild(block);
        });
      });
    });
  }
});

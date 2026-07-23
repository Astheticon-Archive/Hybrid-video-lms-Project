// Hybrid Video LMS Application Script

let activePollInterval = null;

document.addEventListener('DOMContentLoaded', () => {
  initPageState();
});

// Initialize State on Page Load (Prevents Stuck "Processing..." bug when navigating back)
async function initPageState() {
  const savedJobId = sessionStorage.getItem('activeJobId');
  const urlParams = new URLSearchParams(window.location.search);
  const paramJobId = urlParams.get('jobId');
  const targetJobId = paramJobId || savedJobId;

  if (targetJobId) {
    try {
      const response = await fetch(`/api/v1/course/jobs/${targetJobId}`);
      if (response.ok) {
        const job = await response.json();
        if (job.status === 'completed') {
          displayVideoPlayer(job);
          return;
        } else if (job.status === 'failed') {
          sessionStorage.removeItem('activeJobId');
          showErrorToast(job.error || 'Previous render job failed. Please try again.');
          showSection('section-form');
          return;
        } else {
          // Still processing
          showSection('section-progress');
          pollJobStatus(targetJobId);
          return;
        }
      }
    } catch (e) {
      console.warn('Failed to recover session job status:', e);
    }
  }

  // Default clean form view
  sessionStorage.removeItem('activeJobId');
  showSection('section-form');
}

// Switch Active View Section
function showSection(sectionId) {
  document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
  const target = document.getElementById(sectionId);
  if (target) {
    target.classList.add('active');
  }
}

// Course Card Selection
function selectCourseCard(cardElement, courseValue) {
  document.querySelectorAll('.course-card').forEach(card => card.classList.remove('active'));
  cardElement.classList.add('active');
  const radio = cardElement.querySelector('input[type="radio"]');
  if (radio) radio.checked = true;
}

// Preset Celebrity Chips
function setPresetCeleb(celebName, gender, buttonElement) {
  document.querySelectorAll('.celeb-chip').forEach(chip => chip.classList.remove('active'));
  buttonElement.classList.add('active');
  
  document.getElementById('celebrity-input').value = celebName;
  document.getElementById('gender-select').value = gender;
}

// Form Submission Handler
async function handleFormSubmit(event) {
  event.preventDefault();

  const course = document.querySelector('input[name="course"]:checked')?.value || 'git';
  const celebrity = document.getElementById('celebrity-input').value.trim();
  const gender = document.getElementById('gender-select').value;

  if (!celebrity) {
    showErrorToast('Please enter a celebrity narrator name.');
    return;
  }

  const btn = document.getElementById('btn-generate');
  btn.disabled = true;

  showSection('section-progress');
  updateProgressUI('Initializing render job...', 5, 'QUEUED');

  try {
    const response = await fetch('/api/v1/course/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ course, celebrity, gender })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP Error ${response.status}`);
    }

    const job = await response.json();
    sessionStorage.setItem('activeJobId', job.job_id);

    if (job.status === 'completed') {
      // Instant cache hit
      updateProgressUI('Instant CDN cache hit! Loading video...', 100, 'COMPLETED');
      setTimeout(() => {
        displayVideoPlayer(job);
      }, 400);
    } else {
      // Background render task
      pollJobStatus(job.job_id);
    }
  } catch (err) {
    btn.disabled = false;
    sessionStorage.removeItem('activeJobId');
    showErrorToast(err.message);
    showSection('section-form');
  }
}

// Poll Render Job Status
function pollJobStatus(jobId) {
  if (activePollInterval) clearInterval(activePollInterval);

  activePollInterval = setInterval(async () => {
    try {
      const response = await fetch(`/api/v1/course/jobs/${jobId}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const job = await response.json();

      if (job.status === 'completed') {
        clearInterval(activePollInterval);
        activePollInterval = null;
        updateProgressUI('Render complete! Multiplexing finished.', 100, 'COMPLETED');
        setTimeout(() => {
          displayVideoPlayer(job);
        }, 500);
      } else if (job.status === 'failed') {
        clearInterval(activePollInterval);
        activePollInterval = null;
        sessionStorage.removeItem('activeJobId');
        showErrorToast(job.error || 'Video render pipeline failed.');
        showSection('section-form');
        document.getElementById('btn-generate').disabled = false;
      } else {
        updateProgressUI(getReadableStatusText(job.status), job.progress || 20, job.status.toUpperCase());
      }
    } catch (err) {
      console.warn('Poll error:', err);
    }
  }, 1200);
}

// Readable Status Messages
function getReadableStatusText(status) {
  switch (status) {
    case 'queued': return 'Queued in render pipeline...';
    case 'generating_audio': return 'Synthesizing celebrity voice narration...';
    case 'probing_durations': return 'Calculating frame speech alignments...';
    case 'rendering_frames': return 'Rendering Revideo layout animation frames...';
    case 'compiling_video': return 'Compiling video track...';
    case 'compiling_audio': return 'Assembling audio track...';
    case 'multiplexing': return 'Multiplexing audio & video tracks into MP4...';
    default: return 'Processing course video...';
  }
}

// Update Progress UI
function updateProgressUI(message, progress, statusBadge) {
  document.getElementById('progress-title').textContent = message;
  document.getElementById('progress-pct').textContent = `${progress}%`;
  document.getElementById('progress-bar-fill').style.width = `${progress}%`;
  document.getElementById('progress-status-badge').textContent = statusBadge;

  // Trackers
  const stepAudio = document.getElementById('step-audio');
  const stepFrames = document.getElementById('step-frames');
  const stepMux = document.getElementById('step-mux');

  if (progress >= 30) stepAudio.classList.add('active');
  if (progress >= 80) stepFrames.classList.add('active');
  if (progress >= 95) stepMux.classList.add('active');
}

// Display Video Player Stage
function displayVideoPlayer(job) {
  showSection('section-player');

  const formattedCourse = (job.course || 'git').toUpperCase();
  const formattedCeleb = job.celebrity ? job.celebrity.charAt(0).toUpperCase() + job.celebrity.slice(1) : 'Narrator';
  
  document.getElementById('player-video-title').textContent = `${formattedCourse} Course - ${formattedCeleb} Voice`;

  const videoElement = document.getElementById('main-video-element');
  const fullCdnUrl = `${window.location.origin}${job.output_url}`;

  videoElement.src = job.output_url;
  videoElement.load();

  document.getElementById('cdn-url-input').value = fullCdnUrl;
  
  const downloadBtn = document.getElementById('download-btn');
  downloadBtn.href = job.output_url;
  downloadBtn.setAttribute('download', `video_${job.course}_${job.celebrity || 'course'}.mp4`);

  const btn = document.getElementById('btn-generate');
  if (btn) btn.disabled = false;
}

// Reset Back to Generator Form
function resetToForm() {
  if (activePollInterval) {
    clearInterval(activePollInterval);
    activePollInterval = null;
  }

  sessionStorage.removeItem('activeJobId');

  const videoElement = document.getElementById('main-video-element');
  if (videoElement) {
    videoElement.pause();
    videoElement.src = '';
  }

  const btn = document.getElementById('btn-generate');
  if (btn) btn.disabled = false;

  showSection('section-form');
}

// Copy CDN URL to Clipboard
function copyCdnUrl() {
  const input = document.getElementById('cdn-url-input');
  if (!input || !input.value) return;

  navigator.clipboard.writeText(input.value).then(() => {
    const toast = document.getElementById('copy-toast');
    toast.style.display = 'block';
    setTimeout(() => {
      toast.style.display = 'none';
    }, 2500);
  }).catch(() => {
    showErrorToast('Failed to copy URL to clipboard.');
  });
}

// Open Raw Video Stream
function openRawVideo() {
  const input = document.getElementById('cdn-url-input');
  if (input && input.value) {
    window.open(input.value, '_blank');
  }
}

// Error Toast Notification
function showErrorToast(msg) {
  const toast = document.getElementById('error-toast');
  document.getElementById('error-toast-msg').textContent = msg;
  toast.style.display = 'flex';
  setTimeout(() => {
    toast.style.display = 'none';
  }, 4500);
}

function dismissError() {
  document.getElementById('error-toast').style.display = 'none';
}

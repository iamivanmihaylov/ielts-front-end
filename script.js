var errorElement = ` <div class="empty-report">
            <img class="medium-image" src="./static/file.svg" alt="File image">
            <h2 class="empty-report-title">Report will be available here</h2>
            <p class="empty-report-text">The report will include your band score, score for the separate parts <br> and parts you need to improve on.</p>
        </div>`

var queryResult = document.querySelector(".final-result");

document.getElementById("get-feedback").addEventListener("click", async function () {
  const title = document.getElementById("essay-title").value;
  const text = document.getElementById("essay-text").value;

  try {
    const loader = `
        <div class="centered-loader">
            <div class="loader"></div>
            <p>Calculating result...</p>
        </div>`;

    queryResult.innerHTML = loader;

    scrollToBottomCustom(1000);

    const response = await fetch("https://localhost:7084/essay/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        question: title,
        essay: text
      })
    });

    if (!response.ok) {
      throw new Error("Failed to fetch the response from the server.");
    }

    const data = await response.json();

    // Create the HTML to populate based on the response
    const reportHTML = `
      <section class="report">
      <h3>Report</h3>
      <section class="widget-result">
          <section class="widget-result-score">
              <div class="stars">
                  <div class="star"><img src="./static/star.svg" alt="star"></div>
                  <div class="star"><img src="./static/star.svg" alt="star"></div>
                  <div class="star"><img src="./static/star.svg" alt="star"></div>
                  <div class="star"><img src="./static/star.svg" alt="star"></div>
              </div>
              <span class="score">${data.averageScore.toFixed(1)}</span>
          </section>
          <section class="progress-bars">
              <section class="progress-bar">
                  <p>CC (Coherence And Cohesion)</p>
                  <section>
                      <div class="progress-bar-outer">
                          <div style="width: ${(data.coherenceAndCohesion.score / 9) * 100}%" class="progress-bar-inner"></div>
                      </div>
                      <span class="score-bar">${data.coherenceAndCohesion.score}/9</span>
                  </section>
              </section>
              <section class="progress-bar">
                  <p>TR (Task Response)</p>
                  <section>
                      <div class="progress-bar-outer">
                          <div style="width: ${(data.taskResponse.score / 9) * 100}%" class="progress-bar-inner"></div>
                      </div>
                      <span class="score-bar">${data.taskResponse.score}/9</span>
                  </section>
              </section>
              <section class="progress-bar">
                  <p>LR (Lexical Resource)</p>
                  <section>
                      <div class="progress-bar-outer">
                          <div style="width: ${(data.lexicalResource.score / 9) * 100}%" class="progress-bar-inner"></div>
                      </div>
                      <span class="score-bar">${data.lexicalResource.score}/9</span>
                  </section>
              </section>
              <section class="progress-bar">
                  <p>GRA (Grammatical Range And Accuracy)</p>
                  <section>
                      <div class="progress-bar-outer">
                          <div style="width: ${(data.grammaticalRangeAndAccuracy.score / 9) * 100}%" class="progress-bar-inner"></div>
                      </div>
                      <span class="score-bar">${data.grammaticalRangeAndAccuracy.score}/9</span>
                  </section>
              </section>
          </section>
      </section>

      ${['coherenceAndCohesion', 'taskResponse', 'lexicalResource', 'grammaticalRangeAndAccuracy'].map(section => `
      <section class="report-scection">
          <div class="report-title-score">
              <h4 class="report-title">${getTitle(section)}</h4>
              <span class="report-score">${data[section].score}/9</span>
          </div>
          <p>${data[section].comment}</p>
          <section class="imporvements-section">
              <span>Improvements:</span>
              <ul>
                  ${data[section].improvements.map(improvement => `<li><p>${improvement}</p></li>`).join('')}
              </ul>
          </section>
      </section>
      <hr>
      `).join('')}

      <section class="report-scection">
          <div class="report-title-score">
              <h4 class="report-title">Summary</h4>
          </div>
          <p>${data.summary}</p>
      </section>
      </section>
      
          <section class="feedback">
        <div class="background-element-third">
            <img src="static/dots-small.svg" alt="">
        </div>

        <div class="background-element-fourth">
            <img src="static/dots-small.svg" alt="">
        </div>

        <div class="background-element-fifth">
            <img src="static/dots-small.svg" alt="">
        </div>

        <div class="background-element-sixth">
            <img src="static/dots-small.svg" alt="">
        </div>

        <a class="btn-call-to-action" href="#">Give Feedback</a>
    </section>`;

    // Inject the generated HTML into the element with the class "report"

    queryResult.innerHTML = reportHTML;

  } catch (error) {
    queryResult.innerHTML = errorElement;
    console.error("Error:", error);
  }
});


function scrollToBottomCustom(duration) {
  const start = window.scrollY;
  const end = document.body.scrollHeight;
  const distance = end - start;
  const startTime = performance.now();

  function scroll(currentTime) {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1);
    const ease = easeInOutCubic(progress);
    window.scrollTo(0, start + distance * ease);

    if (progress < 1) {
      requestAnimationFrame(scroll);
    }
  }

  requestAnimationFrame(scroll);
}

// Easing function for a smoother effect
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function getTitle(key){
  switch(key) {
    case 'coherenceAndCohesion':
      return 'Coherence And Cohesion'
    case 'taskResponse':
      return 'Task Response'
    case 'lexicalResource':
      return 'Lexical Resource'
    case 'grammaticalRangeAndAccuracy':
      return 'Grammatical Range And Accuracy'
    default:
      return 'Unknown'
  }
}
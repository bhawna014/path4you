document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('nav ul li a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();

                const targetId = this.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);

                window.scrollTo({
                    top: targetSection.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Fetch job listings from Adzuna API
    fetchJobs();

    function fetchJobs() {
        const appId = 'a08a8501'; // Replace with your Adzuna App ID
        const appKey = 'e32571c0af674307373f26c0b26d6639'; // Replace with your Adzuna App Key
        const url = `https://api.adzuna.com/v1/api/jobs/us/search/1?app_id=a08a8501&app_key=e32571c0af674307373f26c0b26d6639&results_per_page=10&what=software%20developer&where=new%20york`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const jobList = document.getElementById('job-list');
                jobList.innerHTML = ''; // Clear any existing content
                data.results.forEach(job => {
                    const jobItem = document.createElement('div');
                    jobItem.classList.add('job-item');
                    jobItem.innerHTML = `
                        <h3>${job.title}</h3>
                        <p>${job.description}</p>
                        <a href="${job.redirect_url}" class="btn" target="_blank">Apply Now</a>
                    `;
                    jobList.appendChild(jobItem);
                });
            })
            .catch(error => console.error('Error fetching jobs:', error));
    }

});
async function fetchGitHubJobListings(query = '') {
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/'; // Proxy server to bypass CORS
    const githubUrl = `https://jobs.github.com/positions.json?description=${query}`;

    try {
        const response = await fetch(proxyUrl + githubUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        displayGitHubJobListings(data);
    } catch (error) {
        console.error('Error fetching GitHub job listings:', error);
        document.getElementById('jobs').textContent = 'Error fetching job listings.';
    }
}

function displayGitHubJobListings(jobs) {
    const jobsContainer = document.getElementById('jobs');
    
    jobs.forEach(job => {
        const jobElement = document.createElement('div');
        jobElement.className = 'job';
        jobElement.innerHTML = `
            <h2>${job.title}</h2>
            <p><strong>Company:</strong> ${job.company}</p>
            <p><strong>Location:</strong> ${job.location}</p>
            <p>${job.description.substring(0, 100)}...</p>
            <a href="${job.url}" target="_blank">View Job</a>
        `;
        jobsContainer.appendChild(jobElement);
    });
}

async function fetchAllJobListings(query = '') {
    await fetchJobListings(query); // Fetch from Adzuna API
    await fetchGitHubJobListings(query); // Fetch from GitHub Jobs API via proxy
}

// Fetch all job listings on page load
fetchAllJobListings();

document.getElementById('search-button').addEventListener('click', () => {
    const query = document.getElementById('search-input').value;
    fetchAllJobListings(query);
});

document.getElementById('search-input').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const query = document.getElementById('search-input').value;
        fetchAllJobListings(query);
    }
});
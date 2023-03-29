document.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    document.getElementById("submit").click();
  }
});

function formatDate(dateString) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const date = new Date(dateString);
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `Joined ${day} ${month} ${year}`;
}

async function getUser() {
  document.getElementById("preloader").style.opacity = 1;
  let username = document.getElementById("input").value;
  if (username.includes("@")) {
    username = username.slice(1);
  }
  if (username.includes("https://github.com/")) {
    username = username.slice(19);
  }
  await fetch("https://api.github.com/users/" + username)
    .then((r) => {
      if (r.ok) {
        return r.json();
      } else {
        let error = new Error(r.statusText);
        error.response = r;
        document.getElementById("preloader").style.opacity = 0;
        document.getElementById("account").style.display = "none";
        document.getElementById(
          "not-found"
        ).innerHTML = `<div class="card card__not-found">
				<h1>${r.status}</h1>
				<p>Not Found</p>
			</div>`;
        document.getElementById("not-found").style.display = "block";
        throw error;
      }
    })
    .then((data) => {
      updateUser(data);
      document.getElementById("preloader").style.opacity = 0; //stop the load
    });
}

function updateUser(json) {
  document.getElementById("not-found").style.display = "none";
  document.getElementById("account").style.opacity = 1;
  document.getElementById("account").style.display = "block";
  document.getElementById("profile__bio").innerHTML = `<img
	src="${json.avatar_url}"
	alt="profile_pic"
	srcset=""
	class="profile__pic"
/>
<h1>${json.name}</h1>
<a href="${json.html_url}">@${json.login}</a>
<p>${json.bio ? json.bio : "This profile has no bio"}</p>
</div>`;
  document.getElementById("created_at").textContent = formatDate(
    json.created_at
  );
  document.getElementById("statistic").innerHTML = `<div class="block">
	<p>Repos</p>
	<h1>${json.public_repos}</h1>
</div>
<div class="block">
	<p>Followers</p>
	<h1>${json.followers}</h1>
</div>
<div class="block">
	<p>Following</p>
	<h1>${json.following}</h1>
</div>`;
  document.getElementById("location").textContent = json.location
    ? json.location
    : "Not Availabel";
  document.getElementById("blog").textContent = json.blog
    ? json.blog
    : "Not Availabel";
  json.blog ? (document.getElementById("blog").href = json.blog) : null;
  document.getElementById("twitter").textContent = json.twitter_username
    ? "@" + json.twitter_username
    : "Not Availabel";
  json.twitter_username
    ? (document.getElementById("twitter").href =
        "https://twitter.com/" + json.twitter_username)
    : null;
  document.getElementById("company").textContent = json.company
    ? json.company
    : "Not Availabel";
  json.company
    ? (document.getElementById("company").href = json.company)
    : null;
}

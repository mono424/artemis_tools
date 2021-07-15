function generateMenuEntry(title, handler) {
	let item = document.createElement("li");
	item.classList.add("nav-item")
	item.addEventListener("click", () => handler());

	let link = document.createElement("a");
	link.classList.add("nav-link");
	let span1 = document.createElement("span");
	let span2 = document.createElement("span");
	span2.innerText = title;

	span1.appendChild(span2);
	link.appendChild(span1);
	item.appendChild(link);
	return item;
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

(function() {

	const mainUrl = "https://artemis.ase.in.tum.de";
	const lectureUrl = "https://artemis.ase.in.tum.de/api/lectures";
	const accessTokenUrl = "https://artemis.ase.in.tum.de/api/files/attachments/access-token";
	const navBar = document.querySelector(".navbar-nav");
	const authHeader = JSON.parse(localStorage.getItem("jhi-authenticationtoken"));
	const instanceId = JSON.parse(localStorage.getItem("jhi-instanceidentifier"));
	axios.defaults.headers.common['Authorization'] = "Bearer " + authHeader;
	axios.defaults.headers.common['x-artemis-client-instance-id'] = instanceId;
	axios.defaults.headers.common['x-artemis-client-fingerprint'] = "";
	

	navBar.prepend(generateMenuEntry("Download all PDF", async () => {
		
		const url = window.location.href
			.replace(".de/courses/", ".de/api/courses/")
			.replace(/[^\/]*?$/, "for-dashboard");
		const result = (await axios.get(url)).data;

		let i = 1;
		for (const lecture of result.lectures) {
			console.log(i++ + " of " + result.lectures.length);

			const lectureInfos = (await axios.get(lectureUrl + "/" + lecture.id)).data;
			
			if (!lectureInfos.lectureUnits) continue;
			for (const lectureUnit of lectureInfos.lectureUnits) {
				if (lectureUnit.type === "attachment") {
					const name = lectureUnit.attachment.link.replace(/^.*\//, "");
					const durl = mainUrl + lectureUnit.attachment.link;
					const accessToken = (await axios.get(accessTokenUrl + "/" + name)).data;
					const response = await axios({
						url: durl,
						method: 'GET',
						responseType: 'blob',
						params: {
							"access_token": accessToken
						}
					});
					download(response.data, name);
					await sleep(500);
				}
			}
			await sleep(4000);
		}

	}));

})();
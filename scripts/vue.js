// *** Vue.js ***//

const app = new Vue({
    el: "#app",
    data: {
        beers: [],
        apiUrl: "https://api.punkapi.com/v2/beers?page=2&per_page=80",
        page: 1,
        perPage: 9,
        pages: [],
        showModal: false,
        selectedBeer: {}
    },

    methods: {

        async fetchData(apiUrl) {
            this.beers = await fetch(apiUrl, {
                    method: "GET",
                    dataType: "jsonp",
                })
                .then(data => data.json())
                // .then(data => data.beers) ** no need because its not an object but an array
                .catch(error => console.log(error))
        },

        setPages() {
            let numberOfPages = Math.ceil(this.beers.length / this.perPage);
            for (let index = 1; index <= numberOfPages; index++) {
                this.pages.push(index);
            }
        },

        paginate(beers) {
            let page = this.page;
            let perPage = this.perPage;
            let from = (page * perPage) - perPage;
            let to = (page * perPage);
            return beers.slice(from, to);
        },

        selectBeer(beer) {
            this.selectedBeer = beer;
            this.showModal = true;
        }

    },

    created() {
        this.fetchData(this.apiUrl)
            .then(() => console.log("before", this.beers))
    },

    watch: {

        beers() {
            this.setPages();
        }
    },

    computed: {

        displayedBeers() {
            return this.paginate(this.beers);
        }

    }
})
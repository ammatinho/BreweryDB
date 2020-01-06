// *** Vue.js ***//

const app = new Vue({
    el: "#app",
    data: {
        loading: true,
        beers: [],
        apiUrl: "https://api.punkapi.com/v2/beers?page=2&per_page=80",
        page: 1,
        perPage: 9,
        pages: [],
        showModal: false,
        selectedBeer: {},
        searchQuery: "",
        message: "No results found. ",
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
            this.loading = false

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
            //uniq values
            let hops = this.hopCategories(beer.ingredients.hops);

            //made a copy of a beer object to be modified
            let selectedBeer = {
                ...beer
            };

            //changing the values aka keys that we want to modify
            selectedBeer['ingredients']['hops'] = hops;

            //sending the modified beer object to the modal to be printed
            this.selectedBeer = selectedBeer;

            this.showModal = true;
        },
        hopCategories(hops) {
            let uniq = [];
            hops.forEach(({
                name
            }) => {
                if (!uniq.includes(name))
                    uniq.push(name)
            });
            return uniq;
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
        },

        filterSearch() {
            return this.beers.filter(beer => {
                console.log(beer.name, this.searchQuery)
                return !this.searchQuery || beer.name.toLowerCase().indexOf(this.searchQuery.toLowerCase()) > -1
            })
        },


    }
})


Vue.component('product', {
    props:['name','type','brand','img','price','index'],
    created() {
        this.$root.$refs["prod"+this.index] = this; //allows us to reference component from popup
    },
    data:function(){
        return{
            toggle:true
        }
    },
    template:'<div class="product" v-bind:index="index" v-bind:class="brand" v-on:click="popUp(name,img,brand,price,index)"><div>{{type}}</div><div>${{price}}</div><img v-bind:alt="type" v-bind:src="img" v-if="img.length>0" /><div v-else>[No image]</div><div>{{name}}</div><div v-if="brand.length>0">by {{brand}}</div><button v-on:click="cart()">Add to Cart</button></div>',
    methods: {
        popUp(name,img,brand,price,index){
            if(this.toggle===false)
                return;
            let popup=document.getElementById("popUp");
            popup.children[0].children[0].innerHTML="$"+price;
            if(img.length===0){
                popup.children[0].children[1].classList.add("hide");
                popup.children[0].children[2].classList.remove("hide");
            }
            else{
                popup.children[0].children[1].classList.remove("hide");
                popup.children[0].children[2].classList.add("hide");
            }
            popup.children[0].children[1].src=img;
            popup.children[0].children[3].innerHTML=name;
            popup.children[0].children[4].innerHTML=brand;
            document.getElementById("popupdiv").className="";
            if(brand.length>0)
                document.getElementById("popupdiv").classList.add(brand);
            this.$root.$refs.popc.target="prod"+index;
            if(this.toggle===true)
                popup.classList.remove("hide");
        },
        cart(){
            this.toggle=false;
            that=this;
            setTimeout(function() {
                that.toggle=true;
            }, 100); //needs delay so that popUp() will run only while toggle is false
            app.cartadd(this.index);
        }
    }
});

Vue.component('popcomp', {
    props:['name','img','brand','price'],
    created() {
        this.$root.$refs.popc = this; //allows us to reference component from outside
    },
    data:function(){
        return{
            toggle:true,
            target:null
        }
    },
    template:'<div class="hide" id="popUp" v-on:click="tog()"><div id="popupdiv"><div id="popprice">${{price}}</div><img id="popimg" v-bind:src="img" /><div class="hide">[No image]</div><div id="popname">{{name}}</div><div id="popbrand">by {{brand}}</div><button v-on:click="cart()">Add to Cart</button></div></div>',
    methods: {
        tog(){
            document.getElementById("popUp").classList.add("hide");
        },
        cart(){
            this.$root.$refs[this.target].cart();
        }
    }
});

let app=new Vue({
    el: "#app",
    data: {
        instruments:[
            {
                name:"Deep in my Soul",
                type:"Bass",
                brand:"Fender",
                img:"img/0146510306_gtr_frt_001_rr.jpg",
                price:"1,399.99"
            },
            {
                name:"Sky Blue Strings",
                type:"Ukulele",
                brand:"Fender",
                img:"img/0971630076_gtr_frt_001_rr.jpg",
                price:"219.99"
            },
            {
                name:"The Lightning Bug",
                type:"Electric Guitar",
                brand:"Maton",
                img:"img/BB1200_Banner.png",
                price:"999.99"
            },
            {
                name:"Warm Classic",
                type:"Acoustic Guitar",
                brand:"Maton",
                img:"img/EBG808TEC_Display_900_350_s.png",
                price:"699.99"
            },
            {
                name:"Marching Silver",
                type:"Euphonium",
                brand:"Yamaha",
                img:"img/B8931CE1B0B844D6BF1248EF351126FF_12073_735x735_08edf3de3d273bdcbdf72c74c3208509.png",
                price:"12,153.00"
            },
            {
                name:"Pillow of Sound",
                type:"Silent Cello",
                brand:"Yamaha",
                img:"img/svc110s_f_0001_804x2756_ced28b467c14ac364573a9d6027f30b4.jpg",
                price:"3,775.00"
            }
        ],
        popdata:{
            name:"test default",
            img:"",
            brand:"test default",
            price:"test default",
        },
        cart: {
            //would be better if I handled all instances of num as being tied to
            //app.cart.content.length but I didn't
            //I went for ++ and -- and that's just how it is
            num:0,
            content:[]
        },
        form:{
            name:"",
            type:"",
            brand:"",
            img:"",
            price:"0"
        }
    },
    methods:{
        cartadd: function(index){
            app.cart.num++;
            app.cart.content.push(app.instruments[index]);
            app.instruments.splice(index,1);
        },
        empty: function(){
            while(app.cart.num>0){
                app.instruments.push(app.cart.content.pop());
                app.cart.num--;
            }
        },
        submit: function(){
            if(app.form.name===""){
                document.getElementById("message").innerHTML="Please enter a name!";
                return;
            }
            let newinst=JSON.parse(JSON.stringify(this.form));
            this.instruments.push(JSON.parse(JSON.stringify(this.form)));
            this.newpop();
            this.form={
                name:"",
                type:"",
                brand:"",
                img:"",
                price:"0"
            }
        },
        newpop:function(){
            let newin=document.getElementById("addnew");
            if(newin.classList.contains("hide")) {
                newin.classList.remove("hide");
                document.getElementById("message").innerHTML="";
            }
            else{
                newin.classList.add("hide");
            }
        }
    }
})

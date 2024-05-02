<template >
  <q-page class="flex flex-center" style="background-color:gainsboro">
    <div>
      <h2 style="color: navy; font-size: 50px; font-family: Arial, sans-serif; text-align: center;"><b>Download any Youtube video in mp4 format</b></h2>
        <q-input filled label="Youtube Link" v-model="link" :error="!isValid" error-message="Not a valid youtube video!"></q-input>
        <q-btn @click="downloadVideo" style="height: 50px;width:100%;color: navy;background-color: aqua;">Download Video</q-btn>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name:"IndexPage",
  data() {
    return {
      link: "",
    };
  },
  methods: {
     async downloadVideo(){
      try {
        this.$q.loading.show({
          message: "Downloading your video....",
        });
        const title = await this.$axios.post
        ("http://localhost:5000/youtube/getTitle", 
        {link: this.link}
      );
      
      const video = await this.$axios.post
        ("http://localhost:5000/youtube/downloadVideo", 
        {link: this.link},
        {
          responseType: "blob",
        }
      );
        const url = window.URL.createObjectURL(new Blob([video.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download",`${title.data}.mp4`);
        document.body.appendChild(link);
        link.click();
      } catch (err) {
        console.log(err);
      }

      this.$q.loading.hide();
     }, 
    },
    computed: {
      isValid(){
        const regex = new RegExp(
          "^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.be)\/.+$" 
        );
        if(this.link && regex.test(this.link) !== true){
          return false;
        }
        return true;
      },
    },
});


</script>

self.addEventListener('push', (e)=>{
        const data = e.data.json();
        console.log(data);
        self.registration.showNotification(data.title,{
            body: data.body,
            icon: 'https://avatars.githubusercontent.com/u/84060723?v=4'
        });
});
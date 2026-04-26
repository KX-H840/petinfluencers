document.addEventListener('DOMContentLoaded', () => {
    // 1. Cover Loop (Straight cut)
    const coverImages = document.querySelectorAll('.cover-loop img');
    let currentCover = 0;
    setInterval(() => {
        coverImages[currentCover].classList.remove('active');
        currentCover = (currentCover + 1) % coverImages.length;
        coverImages[currentCover].classList.add('active');
    }, 1000);

    // 2. Navigation
    const hamburger = document.getElementById('hamburger');
    const navOverlay = document.getElementById('nav-overlay');
    const navClose = document.getElementById('nav-close');
    const navLinks = document.querySelectorAll('.nav-overlay a');

    hamburger.addEventListener('click', () => {
        navOverlay.classList.add('open');
    });

    const closeNav = () => {
        navOverlay.classList.remove('open');
    };

    navClose.addEventListener('click', closeNav);
    
    // Close overlay when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', closeNav);
    });

    // 3. Center-focused playback for horizontal gallery
    const videoSeries = document.getElementById('video-series');
    const videos = videoSeries ? videoSeries.querySelectorAll('video') : [];
    const dots = document.querySelectorAll('#video-series-dots .dot');
    const overlay = document.getElementById('video-overlay');
    const overlayVideo = document.getElementById('overlay-video');
    const closeOverlay = document.getElementById('close-overlay');

    if (videoSeries && videos.length > 0) {
        const updateCenteredVideo = () => {
            const containerRect = videoSeries.getBoundingClientRect();
            const containerCenterX = containerRect.left + containerRect.width / 2;

            let activeIndex = 0;
            let smallestDistance = Infinity;

            videos.forEach((video, index) => {
                const rect = video.getBoundingClientRect();
                const videoCenterX = rect.left + rect.width / 2;
                const distance = Math.abs(containerCenterX - videoCenterX);
                if (distance < smallestDistance) {
                    smallestDistance = distance;
                    activeIndex = index;
                }
            });

            videos.forEach((video, index) => {
                if (index === activeIndex) {
                    video.play().catch(() => {});
                } else {
                    video.pause();
                }
            });

            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === activeIndex);
            });
        };

        let rafId;
        const requestCenteredUpdate = () => {
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(updateCenteredVideo);
        };

        videoSeries.addEventListener('scroll', requestCenteredUpdate, { passive: true });
        window.addEventListener('resize', requestCenteredUpdate);
        window.addEventListener('load', requestCenteredUpdate);
        requestCenteredUpdate();
    }
        videos.forEach(video => {
        // Add visual cue that video can be enlarged
        video.style.cursor = 'zoom-in';

        // Click to Enlarge Function
        video.addEventListener('click', () => {
            overlayVideo.src = video.src;
            overlay.style.display = 'flex';
            overlayVideo.play();
            });
        });
        // Close Enlarged Video
        closeOverlay.addEventListener('click', () => {
            overlay.style.display = 'none';
            overlayVideo.pause();
            overlayVideo.src = "";
        });

        // Stop All Videos when scrolling away from the series section
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // If the entire horizontal gallery section is no longer visible
                if (!entry.isIntersecting) {
                    videos.forEach(v => v.pause());
                }
            });
        }, { threshold: 0.1 }); // Triggers when only 10% of the section is visible

        if (videoSeries) {
            sectionObserver.observe(videoSeries);
        }

    const allVideos = document.querySelectorAll('video');

    const observerOptions = {
        root: null, // use the viewport
        threshold: 0.1 // trigger when at least 10% of the video is visible
    };

    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            
            if (entry.isIntersecting) {
                // Video is in view - you can optionally auto-play here if desired
                // video.play(); 
            } else {
                // Video is out of view - pause it
                video.pause();
            }
        });
    }, observerOptions);

    // Start observing all videos on the page
    allVideos.forEach(video => {
        videoObserver.observe(video);
    });

    // --- Icon Chart Logic ---
    const personPath = "M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z";

    const datasets = {
        douyin: {
            t1: "> 10M Followers",
            t2: "5M-10M Followers",
            color1: "#5c3209", // Accent color
            color2: "#e57c13", // Sage green
            years: ["2019", "2020", "2021", "2022", "2023", "2024", "2025"],
            data1: [2, 5, 16, 21, 23, 23, 22],
            data2: [2, 14, 35, 44, 45, 50, 53]
        },
        xhs: {
            t1: "> 2M Followers",
            t2: "1M-2M Followers",
            color1: "#826316",
            color2: "#e1b649",
            years: ["2020", "2021", "2022", "2023", "2024", "2025"],
            data1: [0, 1, 7, 12, 17, 21],
            data2: [1, 7, 24, 45, 46, 47]
        }
    };

    function renderIconChart(key) {
        const config = datasets[key];
        document.getElementById('label-t1').innerText = config.t1;
        document.getElementById('label-t2').innerText = config.t2;
        
        document.getElementById('toggle-douyin').classList.toggle('active', key === 'douyin');
        document.getElementById('toggle-xhs').classList.toggle('active', key === 'xhs');

        const content = document.getElementById('chart-content');
        const xAxis = document.getElementById('x-axis');
        content.innerHTML = '';
        xAxis.innerHTML = '';

        config.years.forEach((year, i) => {
            const col = document.createElement('div');
            col.className = 'year-col';
            col.appendChild(createGroup(config.data1[i], config.color1));
            col.appendChild(createGroup(config.data2[i], config.color2));
            content.appendChild(col);

            const yearTag = document.createElement('div');
            yearTag.className = 'year-tag';
            yearTag.innerText = year;
            xAxis.appendChild(yearTag);
        });
    }

    function createGroup(count, color) {
        const wrapper = document.createElement('div');
        wrapper.className = 'icon-group-wrapper';

        if (count > 0) {
            const label = document.createElement('div');
            label.className = 'count-text';
            label.style.color = color;
            label.innerText = count;
            wrapper.appendChild(label);

            const grid = document.createElement('div');
            grid.className = 'icon-grid';

            for (let i = 0; i < count; i++) {
                const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                svg.setAttribute("viewBox", "0 0 24 24");
                svg.setAttribute("class", "person-svg");
                svg.style.fill = color;
                
                const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                path.setAttribute("d", personPath);
                svg.appendChild(path);
                grid.appendChild(svg);
            }
            wrapper.appendChild(grid);
        }
        return wrapper;
    }

    // Set up toggle event listeners
    const btnDouyin = document.getElementById('toggle-douyin');
    const btnXhs = document.getElementById('toggle-xhs');
    if (btnDouyin && btnXhs) {
        btnDouyin.addEventListener('click', () => renderIconChart('douyin'));
        btnXhs.addEventListener('click', () => renderIconChart('xhs'));
    }

    // Initialize default state
    if (document.getElementById('chart-content')) {
        renderIconChart('douyin');
    }

    // 5. Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // 我们要处理的滚动触发图层（从第2层到第8层）
    const scrollLayers = [
        "#Layer_2", "#Layer_3", "#Layer_4", 
        "#Layer_5", "#Layer_6", "#Layer_7", "#Layer_8"
    ];

    // 循环为每一层创建动画
    scrollLayers.forEach((id) => {
        gsap.fromTo(id, 
            { 
                opacity: 0, 
                y: 30  /* 初始在下方 60px */
            }, 
            { 
                opacity: 1, 
                y: 0, 
                duration: 1, 
                ease: "power2.out",
                scrollTrigger: {
                    trigger: id,           // 以当前图层为触发点
                    start: "top 50%",      // 当图层顶部滑到屏幕 80% 高度时触发
                    toggleActions: "play none none reverse",// 往回滚时动画会倒放
                    end: "top 20%",
                    scrub: false
                }
            }
        );
    });
    // --- Expanded View Logic ---
    const data = [
        {
            source: "Advertising (Main Income Source)",
            desc: "Collaborating with brands and posting sponsored photos or videos",
            details: "Brands care more about accounts’ viewer engagement than raw follower counts. Even accounts with a moderate amount of fans can attract sponsors if their average likes, saves, and comments are strong.",
            captions: ["Pet food Advertising", "Home appliances Advertising"],
            images: ["media/ad1.png", "media/ad2.png"]
        },
        {
            source: "Product Sales",
            desc: "livestreaming e-commerce or listing product links in their showcase on social media",
            details: "Showcases on Xiaohongshu have a relatively low conversion rate. In contrast, Douyin showcases attract more traffic with low commission, making it easy to receive passive orders. Livestreaming e-commerce is primarily on Douyin.",
            captions: ["Xiaohongshu showcase", "Livestreaming selling"],
            images: ["media/product1.jpg", "media/live2.png"]
        },
        {
            source: "Customer Acquisition",
            desc: "Driving traffic to offline pet stores, pet parks, pet cafés, etc.",
            details: "Customer acquisition is usually small-scale. Pet influencers promote pet parks, pet cafés, and other places by posting photos or videos from their visits, attracting followers to visit in person.",
            captions: ["Promoting pet-friendly parks", "Promoting pet cafés"],
            images: ["media/customer1.png", "media/customer2.png"]
        },
        {
            source: "Building a Brand",
            desc: "Establishing their own brands of pet food, pet snacks, pet meal packs, etc.",
            details: "Some pet influencers establish their own pet food brands. However, the chances of long-term success are low. Some partner with established brands to create a custom pet food. Others make homemade pet food and market it directly to their audience.",
            captions: ["Pet content creator Deng Feng's pet food brand", "Homemade pet food brand"],
            images: ["media/brand.png", "media/brand2.png"]
        },
        {
            source: "Fun Images & Sticker Pack Sales",
            desc: "Selling pet photos, wallpapers, memes, or sticker packs",
            details: "Pet influencers sell photos, wallpapers, memes, and stickers featuring their pets at a low price per order. The main platforms for these sales are Xianyu and Xiaohongshu.",
            captions: ["Pet sticker merchandise", "Digital meme & photos store"],
            images: ["media/stickers1.png", "media/stickers2.png"]
        }
    ];

    const grid = document.getElementById('grid');
    const closeBtn = document.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeExpanded);
        }


    data.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = `card item-${index}`;
        card.innerHTML = `
            <h3>${item.source}</h3>
            <p>${item.desc}</p>
        `;
        card.onclick = () => showExpanded(index);
        grid.appendChild(card);
    });

    function showExpanded(index) {
        const item = data[index];
        document.getElementById('exp-title').innerText = item.source;
        document.getElementById('exp-details').innerText = item.details;
        
        // Update images and captions
        document.getElementById('img-1').src = item.images[0];
        document.getElementById('img-2').src = item.images[1];
        document.getElementById('cap-1').innerText = item.captions[0];
        document.getElementById('cap-2').innerText = item.captions[1];
        
        document.getElementById('overlay').classList.add('active');
    }

    function closeExpanded() {
        const overlay = document.getElementById('overlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
    }




    // 4. Auto-play videos when they come into view and pause when they go out of view
    const introVideo = document.getElementById('intro-video');

    if (introVideo) {
        const observerOptions = {
            root: null, // use the viewport as the root
            threshold: 0.5 // 50% of the video must be visible to trigger
        };

        const handleIntersection = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Video is in view, try to play
                    introVideo.play().catch(error => {
                        console.log("Autoplay was prevented by the browser until user interaction.");
                    });
                } else {
                    // Video is out of view, pause it
                    introVideo.pause();
                }
            });
        };

        const observer = new IntersectionObserver(handleIntersection, observerOptions);
        observer.observe(introVideo);
    }

    //5. urban pet line chart
    Chart.register(ChartDataLabels);
    const ctx = document.getElementById('petChart').getContext('2d');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
            datasets: [
                {
                    label: 'Dogs',
                    data: [50.85, 55.03, 52.22, 54.29, 51.19, 51.75, 51.55, 50.82],
                    borderColor: '#ffb137', // --accent-color
                    backgroundColor: '#ffb137',
                    borderWidth: 3,
                    pointRadius: 2,
                    tension: 0.3
                },
                {
                    label: 'Cats',
                    data: [40.64, 44.12, 48.62, 58.06, 65.36, 69.80, 72.64, 75.83],
                    borderColor: '#d06404', // --sage-green
                    backgroundColor: '#d06404',
                    borderWidth: 3,
                    pointRadius: 2,
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                datalabels: {
                    display: false
                },

                title: {
                    display: true,
                    text: 'Urban Pet Population (2018-2025)',
                    color: '#000000',
                    margin:{ bottom: 100 },
                    font: { family: 'Helvetica', size: 23, weight: 'bold' },
                    padding: {top: 10,bottom: 40}
                },
                legend: {
                    position: 'bottom',
                    labels: {
                        font: { family: 'var(--font-sans)', size: 14, weight: 500},
                        color: '#333333',
                    }
                }
            },
            scales: {
                y: {
                    min: 35,
                    grace: '10%',
                    ticks: {
                        color: '#333333',
                        font: { family: 'var(--font-sans)', size: 20, weight: 500 },
                        callback: (value) => value + 'M'
                    }
                },
                x: {

                    ticks: { 
                        color: '#333333',
                        font: { family: 'var(--font-sans)', size: 20, weight: 500 } },

                grid: {display: false }

                    }
            }
        }
    });

    //6. livestream bar chart

    const liveCtx = document.getElementById('livestreamChart').getContext('2d');

    const labels = [
        'Landi Family', 'Deng Feng', 'I Have Two Cats', 'Brother Gun', 
        'Meow Fans', 'Alpaca Lele', 'Myfoodie Official', 
        'Fregate Official', 'Xianlang Official', 'Kuanfu Flagship'
    ];

    const yuanData = [
        18399500, 15192300, 13506300, 12324900, 11199800, 
        9515600, 8505300, 7953000, 7594300, 7005400
    ];

    const rate = 1.15; 

    new Chart(liveCtx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Revenue',
                data: yuanData,
                backgroundColor: '#d06404', 
                hoverBackgroundColor: '#864218',
                borderRadius: 4,
                barPercentage: 2.0, 
                categoryPercentage: 1.0,
                barThickness: 20
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            animation: {
                duration: 2000,
                easing: 'easeOutQuart'
            },
            plugins: {
                datalabels: {
                    display: false 
                },
                legend: { display: false },
                title: {
                    display: true,
                    text: 'Top 10 Douyin Pet Influencers Livestreaming Sales (Dec 2025)',
                    color: '#000000',
                    font: { family: 'Helvetica', size: 23, weight: 'bold' },
                    padding: {top: 10,bottom: 40}
                },
                tooltip: {
                    enabled: true,
                    callbacks: {
                        label: function(context) {
                            const yuan = context.raw;
                            const hkd = Math.round(yuan * rate);
                            return ` ${yuan.toLocaleString()} (HK$${hkd.toLocaleString()})`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    grid: { display: true, color: '#b6b2b2' },
                    ticks: {
                        // 1. 减少标签数量
                        maxTicksLimit: 4, 
                        color: '#333333',
                        font: { family: 'var(--font-sans)', size: 20 },
                        // 2. 格式化 X 轴标签
                        callback: function(value) {
                            const yuan = value.toLocaleString();
                            const hkd = Math.round(value * rate).toLocaleString();
                            return yuan + ' (HK$' + hkd + ')';
                        }
                    }
                },
                y: {
                    grid: { display: false },
                    ticks: {
                        autoSkip: false,
                        color: '#333333',
                        font: { family: 'var(--font-sans)', size: 20, weight: 500 }
                    }
                }
            }
        }
    });
    // Ensure GSAP and ScrollTrigger are registered
    gsap.registerPlugin(ScrollTrigger);

    // Target each floating box
    gsap.utils.toArray('.floating-box p').forEach((box) => {
        gsap.to(box, {
            scrollTrigger: {
                trigger: box,
                start: "top 60%", // Starts appearing when box is near middle
                end: "top 30%",
                scrub: 1,
                toggleActions: "play reverse play reverse"
            },
            opacity: 1,
            y: 0,
            duration: 0.5
        });
    });

    gsap.registerPlugin(ScrollTrigger);

    // Timeline to swap QQ trainingimages based on text scroll position
    ScrollTrigger.create({
        trigger: "#step2",
        start: "top center", // When the second text box hits the middle of the screen
        onEnter: () => {
            document.getElementById('img-before').style.display = 'none';
            document.getElementById('img-after').style.display = 'block';
        },
        onLeaveBack: () => {
            document.getElementById('img-before').style.display = 'block';
            document.getElementById('img-after').style.display = 'none';
        }
    });

    
});


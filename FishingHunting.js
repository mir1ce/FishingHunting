// ==UserScript==
// @name         FishingHunting
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  检测当前页面是否为钓鱼网站，并显示警告弹窗。如果网站加载时间超过5秒，则提示是否需要检测。如果未匹配到钓鱼站点，则显示“该站点正常”并动态倒计时5秒后退出。常见搜索引擎页面（如Google、Baidu、Bing）不显示弹窗。
// @author       爱做梦的大米饭
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  // 常见搜索引擎域名列表
  const searchEngines = [
    'www.google.com',
    'www.baidu.com',
    'www.bing.com',
    'www.yahoo.com',
    'www.duckduckgo.com',
    'www.yandex.com',
    'www.sogou.com',
    'www.so.com',
    'cn.bing.com'
  ];

  // 银狐病毒钓鱼域名列表
  const silverFoxPhishingDomains = [
    'chrome-web.com',
    'wps-offices.com',
    'xshell-chinese.com',
    'youdaotranslate.com',
    'zh-chrome.com',
    'hostbuf.net',
    'windterm.net',
    'youdaofy.com',
    'wpszhushou.com',
    'wps-word.com',
    'www.chrome-web.com',
    'sogou-shurufa.com',
    'gugellq.com',
    'www.deeplcn.com',
    'quickqpc.com',
    'line-pc.org',
    'sogou-srf.com',
    'chrome-gw.com',
    'wps-gw.com',
    'wps-guanwang.com',
    'xshell7.com',
    'sogouinput.com',
    'www.xshell7.com',
    'www.v2rayn-cn.com',
    'www.wpszhushou.com',
    'www.chrome-win.com',
    'chrome-win.com',
    'www.quickqpc.com',
    'ewaiwai.com',
    'ydtranslate.org',
    'www.sogousrf.com',
    '2345kantuwang.org',
    'line-tw.org',
    'firefox-web.com',
    'www.wps-offices.com',
    'www.eyychat.com',
    'tranworlds.org',
    'windterm.org',
    'www.sogouinput.com',
    'www.xshell-chinese.com',
    'youdaofanyi.org',
    'winterm.org',
    'v2rayn-cn.com',
    'www.windterm.org',
    '2345photo.com',
    'www.wps-gw.com',
    'www.youdaofanyi.org',
    'wpsguanwang.com',
    'www.sogou-shurufa.com',
    'sogousrf.com',
    'www.gugellq.com',
    'www.xshell.pro',
    'down.xshell.pro',
    'sougousrf.com',
    'www.signal-cn.org',
    'www.line-tw.org',
    'xshell.pro',
    'www.signalgw.org',
    'signalgw.org',
    'www.line-pc.org',
    'www.winterm.org',
    'www.ewaiwai.com',
    'telegrrm.com',
    'www.telegram-tw.com',
    'www.quantifybot.com',
    'letsvpn.asia',
    'www.letsvpn.asia',
    'quantifybot.com',
    'shop.xshell.pro',
    'letsvpm.com',
    'sougousrfa.com',
    'www.todeskq.top',
    // 新增的恶意域名
    '103.143.159.111',
    '103.143.159.94',
    '103.143.159.98',
    '103.15.104.242',
    '103.163.46.172',
    '103.253.13.59',
    '103.36.166.149',
    '104.21.15.115',
    '104.21.16.191',
    '104.21.30.24',
    '104.21.33.112',
    '104.21.4.219',
    '104.21.44.41',
    '104.21.50.201',
    '104.21.63.17',
    '104.21.67.152',
    '104.21.83.241',
    '104.21.89.234',
    '110.42.2.115',
    '114.134.189.99',
    '114.29.254.8',
    '114.29.255.45',
    '121.37.160.16',
    '123.60.48.116',
    '124.156.134.59',
    '124.156.185.102',
    '150.109.68.68',
    '150.109.76.206',
    '154.213.26.46',
    '156.241.132.69',
    '172.67.130.220',
    '172.67.140.212',
    '172.67.143.80',
    '172.67.148.236',
    '172.67.150.109',
    '172.67.161.227',
    '172.67.166.144',
    '172.67.177.134',
    '172.67.178.193',
    '172.67.183.119',
    '172.67.192.54',
    '172.67.194.205',
    '172.67.197.152',
    '172.67.202.4',
    '18.166.188.156',
    '18.228.225.125',
    '206.238.115.108',
    '211.99.98.76',
    '211.99.99.150',
    '23.225.205.171',
    '23.225.205.173',
    '23.225.7.163',
    '23.225.7.166',
    '2345zip.hehuashangwu02.xyz',
    '2345zip.hehuashangwu02.xyz:21',
    '361.ploos.top',
    '38.47.106.189',
    '43.129.172.114',
    '43.154.136.10',
    '43.154.192.213',
    '43.154.23.202',
    '43.154.49.3',
    '43.154.61.105',
    '43.154.80.187',
    '43.155.69.56',
    '43.248.190.199',
    '45.116.166.251',
    '45.116.166.27',
    '45.116.166.40',
    '45.125.51.25',
    '45.125.51.7',
    '45.204.83.22',
    '45.204.83.42',
    '47.240.76.132',
    '47.242.43.15',
    '59.56.110.104',
    '60.204.174.33',
    '8.217.38.145',
    '96.43.110.12',
    '96.43.110.26',
    '96.43.110.27',
    'a.fhuehuy7.cn',
    'a.zjsdfg.cn',
    'a1.nykoy06.top',
    'aa.nykoy01.shop',
    'aa1.sdsl07.top',
    'aa2.sdsl07.top',
    'aa3.sdsl07.top',
    'ab.nykoy01.shop',
    'ad.jianying-pro.cc',
    'ad.jy2023.cc',
    'ad.nykoy01.shop',
    'al.fapiaozx.com',
    'antey.sbs',
    'asdfghwin02.hhzef.cn',
    'asdfwspp03.whroz.cn',
    'atjzw.sbs',
    'autodiscover.atjzw.sbs',
    'autodiscover.ghfdt.sbs',
    'autodiscover.ijytr.sbs',
    'autodiscover.ktfgr.sbs',
    'autodiscover.nefgs.sbs',
    'autodiscover.pjuyt.sbs',
    'autodiscover.vrheg.sbs',
    'autodiscover.yrfgd.sbs',
    'b.fheuheg8.cn',
    'b1.nykoy06.top',
    'c.zjsdfg.cn',
    'cff01.027jly.com',
    'cpanel.ghfdt.sbs',
    'cpanel.ijytr.sbs',
    'cpanel.ktfgr.sbs',
    'cpanel.nefgs.sbs',
    'cpanel.pjuyt.sbs',
    'cpanel.vrheg.sbs',
    'cpanel.yrfgd.sbs',
    'cpcalendars.atjzw.sbs',
    'cpcalendars.ghfdt.sbs',
    'cpcalendars.ijytr.sbs',
    'cpcalendars.ktfgr.sbs',
    'cpcalendars.nefgs.sbs',
    'cpcalendars.pjuyt.sbs',
    'cpcalendars.vrheg.sbs',
    'cpcalendars.yrfgd.sbs',
    'cpcontacts.atjzw.sbs',
    'cpcontacts.ghfdt.sbs',
    'cpcontacts.ijytr.sbs',
    'cpcontacts.ktfgr.sbs',
    'cpcontacts.nefgs.sbs',
    'cpcontacts.pjuyt.sbs',
    'cpcontacts.vrheg.sbs',
    'cw.mandongzuoxinxi.cn',
    'dd.sdsl06.top',
    'dd001.wolfing1235.cn',
    'ding.qdjyswkj.com',
    'ding.yincaitong.com.cn',
    'dingd.wolfing1234.cn',
    'dingding.fjeihg3.cn',
    'dou.qdjyswkj.com',
    'doushop.lianhuawangluo07.xyz',
    'down.cstny.xyz',
    'down.qianniu.icu',
    'down.qianniu2023.cc',
    'dsf01.whnmzw.cn',
    'fapiaoi.com',
    'fwiop.club',
    'fyjughk.top',
    'fyjughk.xyz',
    'fz.mandongzuoxinxi.cn',
    'ghfdt.sbs',
    'hfmzkj.top',
    'hjklnmwps04.hhzef.cn',
    'huiyi.sxnjal.cn',
    'huiyix.icu',
    'hy.fjehh9.cn',
    'ijytr.sbs',
    'jetdh.sbs',
    'jhges.sbs',
    'jy.hecishangwu.xyz',
    'jy.hehuashangwu01.xyz',
    'jy.hehuashangwu04.xyz',
    'jy.hehuashangwu20.xyz',
    'jy.lianhuawangluo17.xyz',
    'jy1.hehuashangwu11.xyz',
    'jy15.lianhuawangluo03.xyz',
    'jy15.lianhuawangluo09.xyz',
    'ktedy.sbs',
    'ktfgr.sbs',
    'kyy.fdjh7889.top',
    'lian.qianmouren.top',
    'luthj.sbs',
    'm.atjzw.sbs',
    'm.ghfdt.sbs',
    'm.ijytr.sbs',
    'm.ktfgr.sbs',
    'm.nefgs.sbs',
    'm.pjuyt.sbs',
    'm.vrheg.sbs',
    'm.yrfgd.sbs',
    'mail.ghfdt.sbs',
    'mail.ktfgr.sbs',
    'mail.nefgs.sbs',
    'mail.pjuyt.sbs',
    'mail.vrheg.sbs',
    'nefgs.sbs',
    'office.hehuashangwu07.xyz',
    'office1.lianhuawangluo20.xyz',
    'office2.hehuashangwu13.xyz',
    'office2.hehuashangwu20.xyz',
    'office2.lianhuawangluo02.xyz',
    'office2.lianhuawangluo08.xyz',
    'office22.lianhuawangluo15.xyz',
    'p.fjehyy6.cn',
    'p.fjeihg9.cn',
    'p.njcsdaq.top',
    'pdf.nykoy06.life',
    'pdf.ogkkl.top',
    'piaojufw.cyou',
    'ppdf.nykoy01.top',
    'pssabe.mboworld.com',
    'pyxiaoyuan.com',
    'qn.hflh2.cn',
    'qwertps01.whroz.cn',
    'rar2.hehuashangwu16.xyz',
    'sa.asog510.com',
    'sdf.kemanxing.top',
    'sg.pdfqo05.top',
    'sg.yysk982.com',
    'shanghu.hehuashangwu12.xyz',
    'smtp.atjzw.sbs',
    'smtp.ghfdt.sbs',
    'smtp.ijytr.sbs',
    'smtp.ktfgr.sbs',
    'smtp.nefgs.sbs',
    'smtp.pjuyt.sbs',
    'smtp.vrheg.sbs',
    'smtp.yrfgd.sbs',
    'sogou1.hehuashangwu10.xyz',
    'sogou2.lianhuawangluo04.xyz',
    'sogou2.lianhuawangluo10.xyz',
    'sougou22.lianhuawangluo24.xyz',
    'sougou22.lianhuawangluo25.xyz',
    'sss.fhgges.cn',
    'telegramde.sbs',
    'telegramvesl.org',
    'telegrrram.com',
    'txhy.qfmailw.com',
    'tyujlih.icu',
    'urbgv.sbs',
    'vrheg.sbs',
    'w.fegee8.cn',
    'w.iejhfh5.cn',
    'wang.hfqc3.cn',
    'wang.iowxk1456.top',
    'wang.mboworld.com',
    'wang.yyghzmd.cn',
    'wangp.winaaa.top',
    'webdisk.atjzw.sbs',
    'webdisk.ghfdt.sbs',
    'webdisk.ijytr.sbs',
    'webdisk.ktfgr.sbs',
    'webdisk.nefgs.sbs',
    'webdisk.pjuyt.sbs',
    'webdisk.vrheg.sbs',
    'webdisk.yrfgd.sbs',
    'webmail.atjzw.sbs',
    'webmail.ijytr.sbs',
    'webmail.nefgs.sbs',
    'webmail.pjuyt.sbs',
    'webmail.vrheg.sbs',
    'webmail.yrfgd.sbs',
    'wf1.sdsl02.top',
    'win.tzhzkj.com',
    'winar.nykoy01.top',
    'winrar.nykoy06.life',
    'wkl.nykoy01.top',
    'wp.fhufe9.cn',
    'wp.herdc.com',
    'wp.hflh2.cn',
    'wp.hfmzwl.top',
    'wp.hfyx3.cn',
    'wp.pdfqo05.top',
    'wp.wsp51si.top',
    'wp.ycmzwy.cn',
    'wppp1.hfmzwlkj.top',
    'wps.nykoy06.life',
    'wps.qdjyswkj.com',
    'wps2.hehuashangwu05.xyz',
    'wpss.nykoy01.top',
    'wwp.sagh5293.top',
    'wwps.tzhzkj.com',
    'www.atjzw.sbs',
    'www.fwiop.club',
    'www.ghfdt.sbs',
    'www.hehuashangwu02.xyz',
    'www.hehuashangwu04.xyz',
    'www.hehuashangwu05.xyz',
    'www.hehuashangwu06.xyz',
    'www.hehuashangwu07.xyz',
    'www.hehuashangwu08.xyz',
    'www.hehuashangwu09.xyz',
    'www.hehuashangwu14.xyz',
    'www.hehuashangwu19.xyz',
    'www.hehuashangwu20.xyz',
    'www.ijytr.sbs',
    'www.ktfgr.sbs',
    'www.lianhuawangluo13.xyz',
    'www.lianhuawangluo14.xyz',
    'www.lianhuawangluo20.xyz',
    'www.lianhuawangluo21.xyz',
    'www.lianhuawangluo22.xyz',
    'www.lianhuawangluo24.xyz',
    'www.lianhuawangluo28.xyz',
    'www.lianhuawangluo29.xyz',
    'www.lianhuawangluo38.xyz',
    'www.lianhuawangluo39.xyz',
    'www.lianhuawangluo39.xyz:22',
    'www.lianhuawangluo39.xyz:43080',
    'www.luthj.sbs',
    'www.piaojufw.top',
    'www.pjuyt.sbs',
    'www.swqe.sbs',
    'www.telegramde.sbs',
    'www.telegramvesl.org',
    'www.telegrrram.com',
    'www.vrheg.sbs',
    'www.yfapiao.cyou',
    'www.yfapiao.top',
    'www.yrfgd.sbs',
    'www.yunfpzx.com',
    'xjtdf.sbs',
    'xl.hflh2.cn',
    'xun.hfyx1.cn',
    'xunl.hfqc3.cn',
    'xunlei11.hehuashangwu15.xyz',
    'xunlei11.lianhuawangluo01.xyz',
    'xunlei11.lianhuawangluo12.xyz',
    'xunlei11.lianhuawangluo23.xyz',
    'xunlei11.lianhuawangluo25.xyz',
    'xw.wsopkf.top',
    'xwbb.mmwu710.com',
    'yrfgd.sbs',
    'yunfpzx.com',
    'yunvfapiao.com',
    'yxc16.chenqingwen.top',
    'yyds.hnxbkjyxgs.com',
    'yyts08.hhzef.cn',
    'zip1.hehuashangwu18.xyz',
    'zip2.lianhuawangluo05.xyz',
    'zip2.lianhuawangluo11.xyz',
    'zuo.zhangsilei.top',
    'zxcvbbnnca03.hhzef.cn',
    'zxcvvbrar02.whroz.cn'
  ];

  // 检测当前页面是否为常见搜索引擎
  function isSearchEnginePage() {
    const domain = window.location.hostname;
    return searchEngines.includes(domain);
  }

  // 检测当前页面是否为银狐病毒钓鱼页面
  function isSilverFoxPhishingPage() {
    const domain = window.location.hostname;
    return silverFoxPhishingDomains.includes(domain);
  }

  // 检测逻辑
  function detectPhishing() {
    // 如果是银狐病毒钓鱼页面，直接显示警告
    if (isSilverFoxPhishingPage()) {
      showPopup(`
        <strong>警告：该站点为银狐病毒钓鱼网站！</strong><br><br>
        请勿下载该站点任何文件。<br><br>
        <div style="display: flex; justify-content: center;">
          <button id="confirm-btn" style="padding: 8px 16px; background-color: #c62828; color: white; border: none; border-radius: 3px; cursor: pointer;">确认</button>
        </div>
      `, '#ffebee', '#c62828', null, true); // 红色背景，红色文字，居中显示
      return; // 直接返回，不再执行后续检测
    }

    const links = document.querySelectorAll('a');
    if (links.length === 0) return;

    // 定义危险文件后缀
    const dangerousExtensions = ['.exe', '.zip', '.rar', '.7z', '.msi'];

    // 遍历所有链接
    let isPhishing = false;
    let phishingHref = '';
    links.forEach(link => {
      if (!link.isConnected) return;
      const href = link.getAttribute('href'); // 使用 getAttribute 获取原始 href

      // 判断 href 是否为相对路径
      if (isRelativeUrl(href)) {
        // 判断 href 是否指向危险文件
        const extension = getFileExtension(href);
        if (dangerousExtensions.includes(`.${extension}`)) {
          isPhishing = true;
          phishingHref = href;
          console.warn('检测到危险文件链接:', href); // 调试信息
        }
      }
    });

    // 如果是钓鱼站点，则显示红色告警弹窗
    if (isPhishing) {
      showPopup(`
        <strong>警告：该站点可能是一个钓鱼网站！</strong><br><br>
        原因：<br>
        1. 发现指向危险文件的相对路径URL: ${phishingHref}<br>
        2. 危险文件后缀可能包含恶意软件。<br>3. 需要对站点进行核对，谨防主机感染银狐病毒。<br>

        <div style="display: flex; justify-content: center;">
          <button id="confirm-btn" style="padding: 8px 16px; background-color: #c62828; color: white; border: none; border-radius: 3px; cursor: pointer;">确认</button>
        </div>
      `, '#ffebee', '#c62828', null, true); // 红色背景，红色文字，居中显示
    } else {
      // 未匹配到钓鱼站点，显示绿色提示弹窗
      showPopup(`
        <strong>该站点正常。</strong><br><br>
        检测未发现异常，<span id="countdown">5</span>秒后提示将自动关闭。
      `, '#e8f5e9', '#2e7d32', 5000, false); // 绿色背景，绿色文字，5秒后自动关闭，右上角显示
    }
  }

  // 判断 URL 是否为相对路径
  function isRelativeUrl(url) {
    if (!url) return false; // 如果 href 为空，返回 false
    return !/^https?:\/\//i.test(url) && !url.startsWith('//') && !url.startsWith('mailto:') && !url.startsWith('tel:');
  }

  // 获取文件后缀
  function getFileExtension(url) {
    if (!url) return '';
    const lastSegment = url.split('/').pop(); // 获取最后一个路径段
    const extension = lastSegment.split('.').pop().toLowerCase(); // 获取文件后缀
    return extension;
  }

  // 显示弹窗
  function showPopup(content, backgroundColor, textColor, autoCloseTimeout = null, isCenter = false) {
    const popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.backgroundColor = backgroundColor; // 背景颜色
    popup.style.color = textColor; // 文字颜色
    popup.style.padding = '20px'; // 增加内边距
    popup.style.border = `1px solid ${textColor}`;
    popup.style.borderRadius = '5px';
    popup.style.zIndex = '10000';
    popup.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    popup.style.fontFamily = 'Arial, sans-serif';
    popup.style.fontSize = '16px'; // 增大字体大小
    popup.style.maxWidth = '400px'; // 增加弹窗宽度
    popup.style.width = 'auto';
    popup.style.animation = 'fadeIn 0.5s ease-in-out'; // 添加淡入动画
    popup.innerHTML = content;

    // 根据 isCenter 参数设置弹窗位置
    if (isCenter) {
      popup.style.top = '50%';
      popup.style.left = '50%';
      popup.style.transform = 'translate(-50%, -50%)'; // 居中显示
    } else {
      popup.style.top = '20px'; // 弹窗显示在页面顶部
      popup.style.right = '20px'; // 弹窗显示在页面右侧
    }

    // 添加到页面中
    document.body.appendChild(popup);

    // 如果有自动关闭时间，设置倒计时
    if (autoCloseTimeout) {
      const countdownElement = popup.querySelector('#countdown');
      let countdown = 5; // 倒计时初始值
      const countdownInterval = setInterval(() => {
        countdown--;
        countdownElement.textContent = countdown;

        // 倒计时结束后关闭弹窗
        if (countdown <= 0) {
          clearInterval(countdownInterval);
          document.body.removeChild(popup);
        }
      }, 1000); // 每秒更新一次
    } else {
      // 绑定确认按钮点击事件
      const confirmBtn = popup.querySelector('#confirm-btn');
      if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
          document.body.removeChild(popup);
        });
      }
    }
  }

  // 获取页面加载时间
  function getPageLoadTime() {
    const timing = performance.timing;
    const loadTime = timing.loadEventEnd - timing.navigationStart; // 页面加载总时间（毫秒）
    return loadTime;
  }

  // 页面加载完成后执行检测
  window.addEventListener('load', () => {
    // 如果是常见搜索引擎页面，则不显示弹窗
    if (isSearchEnginePage()) {
      return;
    }

    // 直接执行检测逻辑，无需用户确认
    detectPhishing();
  });
})();

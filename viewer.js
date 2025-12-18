const url = 'slides.pdf';
let pdfDoc = null, pageNum = 1, pageRendering = false, canvas = document.getElementById('pdf-canvas'), ctx = canvas.getContext('2d');

pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdf.worker.js';

function renderPage(num) {
    pageRendering = true;
    pdfDoc.getPage(num).then(function(page) {
        const viewport = page.getViewport({ scale: 1.5 });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = { canvasContext: ctx, viewport: viewport };
        const renderTask = page.render(renderContext);

        renderTask.promise.then(() => { pageRendering = false; });
    });
}

pdfjsLib.getDocument(url).promise.then(function(pdfDoc_) {
    pdfDoc = pdfDoc_;
    renderPage(pageNum);
});

function queueRenderPage(num) {
    if(pageRendering) setTimeout(() => queueRenderPage(num), 100);
    else renderPage(num);
}

document.addEventListener('keydown', e => {
    if(e.key === 'ArrowRight' && pageNum < pdfDoc.numPages) pageNum++, queueRenderPage(pageNum);
    if(e.key === 'ArrowLeft' && pageNum > 1) pageNum--, queueRenderPage(pageNum);
});

document.addEventListener('dblclick', () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
});

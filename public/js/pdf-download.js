// PDF Download functionality for legal documents

class PDFDownloader {
    constructor() {
        this.storage = firebase.storage();
        this.documentMappings = {
            'privacyDocument': {
                fileName: 'Privacy_Policy.pdf',
                displayName: 'Privacy Policy',
                token: 'fd576300-46f8-44d1-94ed-90ba644e79e9'
            }
        };
    }

    /**
     * Try multiple approaches to downloading the PDF
     */
    async downloadDocument(documentType, documentTitle) {
        const downloadBtn = document.getElementById('download-pdf-btn');
        if (!downloadBtn) return;

        try {
            // Update button state
            downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';
            downloadBtn.disabled = true;

            // First, try to get the download URL
            await this.tryDirectDownload(documentType, documentTitle);

        } catch (error) {
            console.error('Download error:', error);
            
            // If direct download fails, show fallback options
            this.showFallbackOptions(documentType, documentTitle);
        } finally {
            // Reset button
            downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download PDF';
            downloadBtn.disabled = false;
        }
    }

    /**
     * Try direct download first
     */
    async tryDirectDownload(documentType, documentTitle) {
        try {
            // Get the correct file name and token from mapping
            const mapping = this.documentMappings[documentType];
            if (!mapping) {
                console.error(`No mapping found for document type: ${documentType}`);
                throw new Error(`Unknown document type: ${documentType}`);
            }
            
            const fileName = mapping.fileName;
            const token = mapping.token;
            
            console.log(`Attempting to download: ${fileName} with token: ${token}`);
            
            // Construct direct download URL with correct domain name and token
            const storageUrl = `https://firebasestorage.googleapis.com/v0/b/mcketweb.firebasestorage.app/o/legal-documents%2F${fileName}?alt=media&token=${token}`;
            
            // Create and click a download link
            const link = document.createElement('a');
            link.href = storageUrl;
            link.download = `${documentTitle}.pdf`;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            return true;
        } catch (error) {
            console.error('Direct download failed:', error);
            throw error; // Re-throw to try fallback
        }
    }

    /**
     * Show fallback options when direct download fails
     */
    showFallbackOptions(documentType, documentTitle) {
        // Create fallback modal
        const modal = document.createElement('div');
        modal.className = 'pdf-fallback-modal';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'pdf-fallback-content';
        
        // Create close button
        const closeBtn = document.createElement('span');
        closeBtn.className = 'pdf-fallback-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.onclick = () => document.body.removeChild(modal);
        
        // Create content
        const header = document.createElement('h3');
        header.textContent = 'Download Options';
        
        const message = document.createElement('p');
        message.innerHTML = 'The direct download couldn\'t be completed. Please choose one of these options:';
        
        // Create buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'pdf-fallback-buttons';
        
        // Option 1: Open in new tab
        const openBtn = document.createElement('button');
        openBtn.className = 'btn btn-primary';
        openBtn.innerHTML = '<i class="fas fa-external-link-alt"></i> Open PDF in New Tab';
        openBtn.onclick = () => {
            const mapping = this.documentMappings[documentType];
            if (!mapping) {
                console.error(`No mapping found for document type: ${documentType}`);
                return;
            }
            
            const fileName = mapping.fileName;
            const token = mapping.token;
            
            // Use correct domain and token in URL
            const storageUrl = `https://firebasestorage.googleapis.com/v0/b/mcketweb.firebasestorage.app/o/legal-documents%2F${fileName}?alt=media&token=${token}`;
            console.log(`Opening in new tab: ${storageUrl}`);
            window.open(storageUrl, '_blank');
            document.body.removeChild(modal);
        };
        
        // Option 2: Ask for help
        const helpBtn = document.createElement('button');
        helpBtn.className = 'btn btn-secondary';
        helpBtn.innerHTML = '<i class="fas fa-headset"></i> Contact Support';
        helpBtn.onclick = () => {
            window.location.href = 'support.html';
        };
        
        // Assemble modal
        buttonContainer.appendChild(openBtn);
        buttonContainer.appendChild(helpBtn);
        
        modalContent.appendChild(closeBtn);
        modalContent.appendChild(header);
        modalContent.appendChild(message);
        modalContent.appendChild(buttonContainer);
        
        modal.appendChild(modalContent);
        
        // Add modal styles (keeping your existing styles)
        document.body.appendChild(modal);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (typeof documentType !== 'undefined' && typeof documentTitle !== 'undefined') {
        const pdfDownloader = new PDFDownloader();
        
        const downloadBtn = document.getElementById('download-pdf-btn');
        if (downloadBtn) {
            // Set initial button text
            downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download PDF';
            
            downloadBtn.addEventListener('click', function() {
                pdfDownloader.downloadDocument(documentType, documentTitle);
            });
        }
    }
});

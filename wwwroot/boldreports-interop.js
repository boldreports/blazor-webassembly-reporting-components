// Interop file to render the Bold Report Viewer component with properties.
window.BoldReports = {
    RenderViewer: function (elementID, reportViewerOptions) {
        $("#" + elementID).boldReportViewer({
            reportPath: reportViewerOptions.reportName,
            reportServiceUrl: reportViewerOptions.serviceURL,
            toolbarSettings: {
                customGroups: [{
                    items: [{
                        type: 'Default',
                        cssClass: "e-icon e-edit e-reportviewer-icon ej-webicon CustomGroup",
                        id: "edit-report",
                        // Need to add the proper header and content once, the tool tip issue resolved.
                        tooltip: {
                            header: 'Edit Report',
                            content: 'Edit this report in designer'
                        }
                    }],
                    // Need to remove the css (e-reportviewer-toolbarcontainer ul.e-ul:nth-child(4)) once the group index issue resolved
                    groupIndex: 3,
                    cssClass: "e-show"
                }]
            },
            toolBarItemClick: function (args) {
                if (args.value === 'edit-report') {
                    let rootPath = location.origin;
                    let reportPath = args.model.reportPath;
                    let ReportDesignerPath = reportPath.indexOf('.rdlc') !== -1 ? '/ReportDesigner/RDLC' : '/ReportDesigner';
                    window.open(`${rootPath}${ReportDesignerPath}?report-name=${reportPath}`,
                        location.href.indexOf('/preview') === -1 ? '_blank' : '_self');
                }
            }
        });
    },
    RenderDesigner: function (elementID, reportDesignerOptions) {
        $("#" + elementID).boldReportDesigner({
            ajaxBeforeLoad: function (args) {
                args.data = JSON.stringify({ reportType: "RDL" });
            },
            serviceUrl: reportDesignerOptions.serviceURL,
            toolbarSettings: { items: ej.ReportDesigner.ToolbarItems.All & ~ej.ReportDesigner.ToolbarItems.Save },
            create: function (args) {
                designerInst = $("#" + elementID).data('boldReportDesigner');
                let reportName = "sales-order-detail.rdl";
                designerInst.setModel({
                    previewOptions: {
                        exportItemClick: "onExportItemClick"
                    }
                });
                if (reportName) {
                    designerInst.openReport(reportName);
                }
            },
            toolbarRendering: function (args) {
                if ($(args.target).hasClass('e-rptdesigner-toolbarcontainer')) {
                    var saveButton = ej.buildTag('li.e-rptdesigner-toolbarli e-designer-toolbar-align e-tooltxt', '', {}, {});
                    var saveIcon = ej.buildTag('span.e-rptdesigner-toolbar-icon e-toolbarfonticonbasic e-rptdesigner-toolbar-save e-li-item', '', {}, { title: 'Save' });
                    args.target.find('ul:first').append(saveButton.append(saveIcon));
                }
            },
            toolbarClick: function (args) {
                if (args.click === 'Save') {
                    args.cancel = true;
                    designerInst.saveToDevice();
                }
            }
        });
    }
};
var excel = require('excel4node');


module.exports.getdidtemplate = function (data, req, res) {
    try {
        var tactictypename = data.tactictypename;
        var workbook = new excel.Workbook();
        var worksheet = workbook.addWorksheet('My Sheet');
        var style = workbook.createStyle({
            font: {
                color: '#000000',
                size: 16
            },
            numberFormat: '$#,##0.00; ($#,##0.00); -'
        });

        //worksheet.cell(2, 1).string('string').style(style);
        worksheet.cell(1, 1).string('Program ID').style(style);
        worksheet.cell(1, 2).string('Tactic ID').style(style);
        worksheet.cell(1, 3).string('did').style(style);
        worksheet.cell(1, 4).string('utm_campaign').style(style);
        worksheet.cell(1, 5).string('utm_source').style(style);
        worksheet.cell(1, 6).string('utm_medium').style(style);
        worksheet.cell(1, 7).string('utm_content').style(style);
        worksheet.cell(1, 8).string('utm_term').style(style);
        worksheet.cell(1, 9).string('URL Only').style(style);
        worksheet.cell(1, 10).string('UTM Parameters & Achor').style(style);
        worksheet.cell(1, 11).string('Anchor Link').style(style);
        worksheet.cell(1, 12).string('Full URL').style(style);
        // worksheet.cell(1, 13).string('Bit.ly').style(style);
        var i = 2;
        data.DIDList.forEach(element => {
            worksheet.cell(i, 1).string(element.programdigitalid);
            worksheet.cell(i, 2).string(element.tcampaigndigitalid);
            worksheet.cell(i, 3).string(element.did);
            worksheet.cell(i, 4).string(element.programname);
            worksheet.cell(i, 5).string(element.sourcename);
            worksheet.cell(i, 6).string(element.mediumname);
            worksheet.cell(i, 7).string(element.content);
            worksheet.cell(i, 8).string(element.term);
            worksheet.cell(i, 9).string(element.url);
            worksheet.cell(i, 10).string(element.utmparameter);
            worksheet.cell(i, 11).string(element.anchorlink);
            worksheet.cell(i, 12).string(element.url + '?' + element.utmparameter + '#' + element.anchorlink);
            i = i + 1;
        });
        i = i + 6;

        // template = GetTemplateByTacticType(TacticType);
        console.log(tactictypename.toLowerCase());
        GetTemplateByTacticType(tactictypename.toLowerCase() , i, worksheet, res, workbook, style)

    } catch (err) {
        console.log('OOOOOOO this is the error: ' + err);
    }
}


function GetTemplateByTacticType(TacticType, i, worksheet, res, workbook, style) {
    if(TacticType == "Postal Mail".toLowerCase() || TacticType == "Events".toLowerCase() || TacticType == "Roadshow".toLowerCase() || TacticType == "public event".toLowerCase() || TacticType == "private event".toLowerCase()){        
        worksheet.cell(i, 1).string('Digital ID Instructions').style(style);
        i = i + 2;
        worksheet.cell(i, 1).string('UTM parameters including the digital ID must be manually appended to the end of landing page URLs. All landing pages must have UTM parameters. ');
        i = i + 1;
        worksheet.cell(i, 1).string('Work with Marcom and MCA Online team to identify and develop appropriate utm_content and utm_term parameters. If it is determined no utm_content or utm_term parameters are necessary, do not use blank parameters.');
        i = i + 1;
        worksheet.cell(i, 1).string('Share this sheet along with any URL parameter updates with web team to append URL parameter string to end of landing page URL and create vanity URL.');
        i = i + 1;       
    }
    else if (TacticType == "Paid Social".toLowerCase())
    {
        worksheet.cell(i, 1).string('Digital ID Instructions').style(style);
        i = i + 2;
        worksheet.cell(i, 1).string('UTM parameters including the Digital ID must be manually appended to the end of landing page URLs and uploaded. All landing pages (Marketo Gated Landing Pages or Drupal Webpages) must have UTM parameters (including DID).');
        i = i + 1
        worksheet.cell(i, 1).string('Work with Media Strategist/Planner and agency to identify and develop appropriate utm_content and utm_term parameters. If it is determined no utm_content or utm_term parameters are necessary, do not use blank parameters.');
        i = i + 1
        worksheet.cell(i, 1).string('Send this sheet along with any URL parameter updates to agency (for example Ogilvy, Nowspeed, Mito) to append URL Parameter string to end of landing page URLs.');
        i = i + 1
        worksheet.cell(i, 1).string('Tactic ID Instructions').style(style);
        i = i + 2;
        worksheet.cell(i, 1).string('The account must be created through Social Media Management (SMM) team, with access granted to agency (for example Ogilvy, Nowspeed, Mito), in order to be included in Campaign Reporting. To do so, file a RAMP request with SMM team.');
        i = i + 1
        worksheet.cell(i, 1).string('Alert SMM team of campaign and share Tactic ID. Tactic ID must be appended at end of the account name (Facebook, LinkedIn) or Funding Source (Twitter) to be included in Campaign Reporting');
        i = i + 1
    }
    workbook.write('did_template.xlsx', res);
}
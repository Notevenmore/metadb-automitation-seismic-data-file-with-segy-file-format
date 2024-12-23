# Help Page Draft

# About

MetaDB is a web application design with modern and intuitive user interface that uses the power of AI to automate the management of metadata that is associated with subsurface oil and gas resources.

MetaDB ensures that all metadata is fully compliant with the regulation specified in the regulation of the minister of energy and mineral resources of the Republic of Indonesia number 7 of 2019. 

## Government regulations on metadata for energy and mineral resources.

According to the ESDM No7/2019 attachment 1 about the standard data management and administration catalogue, there is a goal to make stakeholder’s data that used to have different types of formats and datatypes to be formatted to one data format that will be the standard so it will ease the submission and utilization process.

With this, it is hoped that it will create a more standardized process that will create a more uniformed references that has the same details and file format. This then will make it easier to process those data by Pusdatin ESDM. This will make the utilization of data fast, complete, and accurate.

# User manual

The user has the ability to insert new records to the database. They can access the data matching methods that can make record making simpler and less time consuming. User also have the ability to manage their own account.

## Login

To login, user needs to enter their user credentials to go to the MetaDB page. They need to fill in their email and password in the input fields. 

<p align="center"> <img src ="/markdown/src/Untitled%208.png" style= "border : 2px solid cornflowerblue; border-radius:10px;"> </p>

## Account settings

User also have the ability to manage their own account, they can see their details as well as upload their own profile picture.

1. The top right of screen will have the user’s profile where they can click and see user settings like the following:
    
    <p align="center"> <img src ="/markdown/src/profile.png" style= "border : 2px solid cornflowerblue; border-radius:10px; width:250;"> </p>    
2. The user will then be sent to a different view where they are able to see their details like E-mail, role and the date they joined. Additionally, they are able to upload their profile picture, change password and even sign out from their profile.
    
    <p align="center"> <img src ="/markdown/src/profile_page.png" style= "border : 2px solid cornflowerblue; border-radius:10px;"> </p>    

After logging in, user will be directed to Add Record page where they can add new records or edit and delete old ones. Here is how the user can manage records:

## Add record

In this page, user has the ability to enter new records to the database. User has two options of entering the data,

- Choose a file manually: user can upload an existing file of the records that has been made before hand or using another platform and our service can analyze your file and make the record for you.
- Make a new record: user can manually input the data live using our service, therefore no need to upload a separate file.

Both actions will have the same output, which is an xls format that is suitable for Pusdatin ESDM.

<p align="center"> <img src ="/markdown/src/dashboard.png" style= "border : 2px solid cornflowerblue; border-radius:10px;"> </p>

## Choose file manually

If you click on `Choose file manually` you can see this page. Here is where you can upload the file and also type the name and pick the type of data you wan to make. The user is able to upload data from a number of different file extensions (PDF, /markdown/src, CSV, LAS, PPTX) that an Optical Character Reader (OCR) is able to directly convert to text. This can be done as follows:

MetaDB is able to convert this to a record that will be saved later on that is directly converted to a record.

<p align="center"> <img src ="/markdown/src/SCR-20230628-sfrs.png" style= "border : 2px solid cornflowerblue; border-radius:10px;"> </p>

### Methods of data matching

There are four different data matching methods that can help user to make the process of moving records from one file to another format a lot easier. 

- Dropdown: once user uploaded their file, our service will read your file and make a list of possible inputs that user can then match with the headers. Users just use our dropdown feature and click on the right data that matches with the header.
- Highlighting: once user uploaded their file, user can select the words by dragging the cursor to the specific word, then our service will read it and translate it to a processable text that can be inputted to the matching header.
- Drag and drop: once user uploaded their file, our service will identify the words and user can drag and drop those words from the document to the input fields next to the header to fill in.
- Automatic: once user uploaded their file, our service will review your file and try to match the records to the matching header. Do not worry, user still have the ability to change the inputs. *only available for 2d datatypes

In this example, the data type used is `print well report`, other data types works the same. 

<p align="center"> <img src ="/markdown/src/Untitled%2011.png" style= "border : 2px solid cornflowerblue; border-radius:10px;"> </p>

### Drop down

User may choose the correct data matches using drop downs.

1. On the page after submitting, user can see a list of headers on the left side of the page. They have empty input fields that the user can click to display a dropdown. On the right side, user can find the data uploaded, they can see the overall layout.

<p align="center"> <img src ="/markdown/src/Untitled%2012.png" style= "border : 2px solid cornflowerblue; border-radius:10px;"> </p>

2. When the user clicked on the input field, a dropdown will appear and the user can pick the right input for that header. Those inputs are generated from the data uploaded. User can also click on the `Search` bar and type the input they expected.

<p align="center"> <img src ="/markdown/src/Untitled%2013.png" style= "border : 2px solid cornflowerblue; border-radius:10px;"> </p>

3. When the user click on the right input, it will fill in the input field. User can still change the input by clicking the input field again to show the dropdown.

<p align="center"> <img src ="/markdown/src/Untitled%2014.png" style= "border : 2px solid cornflowerblue; border-radius:10px;"> </p>

4. If the user decided to leave it blank or inputted the wrong text, they can always click on the reset button or the `X` button to erase the input from the input field. This will remove the text and user is still allowed to continue to the next page without specifying the inputs.

<p align="center"> <img src ="/markdown/src/Untitled%2015.png" style= "border : 2px solid cornflowerblue; border-radius:10px;"> </p>

5. When done, user can click on the `View on sheets` button to move to the next page.

<p align="center"> <img src ="/markdown/src/Untitled%2016.png" style= "border : 2px solid cornflowerblue; border-radius:10px;"> </p>

---
Here is a small demo on how to use the dropdown method:
<p align="center"> <img src ="/markdown/src/2023-07-09 22-25-14.gif" style= "border : 2px solid cornflowerblue; border-radius:10px;"> </p>  

### Highlighting

User may drag their cursor to select the words they want to use as an input.

1. On the page after submitting, user can see a list of headers on the left side of the page. They have empty input fields that the user can click and they can use their cursor to drag select on the words they want to use an inputs. On the right side, user can find the data uploaded, they can see the overall layout.

<p align="center"> <img src ="/markdown/src/Untitled%2017.png" style= "border : 2px solid cornflowerblue; border-radius:10px;"> </p>

2. User needs to click on the input field on next to header that they want to input with the words, this is to tell our service to insert the words there after the user has selected the words.

<p align="center"> <img src ="/markdown/src/Untitled%2018.png" style= "border : 2px solid cornflowerblue; border-radius:10px;"> </p>

3. The user can select the words by clicking on this logo and they need to click on the document and release their click, then move their cursor until the box created covers the words they want to use an inputs. Then the user have to click it again to capture the words.

<p align="center"> <img src ="/markdown/src/Untitled%2019.png" style= "border : 2px solid cornflowerblue; border-radius:10px;"> </p>

4. Once user select on the word, it will automatically rendered to a processable text and be inputted to the input field 

<p align="center"> <img src ="/markdown/src/2023-07-09 22-38-56.gif" style= "border : 2px solid cornflowerblue; border-radius:10px;"> </p>  


### Drag and drop

The user may also choose the drag and drop option. In this feature, users are able to drag specific texts and drop on to specific fields according to their headers.

1. On the page after submitting, user can see a list of headers on the left side of the page. They have empty input fields that the user can click and they can use their cursor to drag select on the words they want to use an inputs. On the right side, user can find the data uploaded, they can see the overall layout.:
    <p align="center"> <img src ="/markdown/src/Untitled%2020.png" style= "border : 2px solid cornflowerblue; border-radius:10px;"> </p>    
2. The user can then click and drag on highlighted texts that are marked blue on the right hand side and drag them onto the left to their assigned headers.:
    <p align="center"> <img src ="/markdown/src/image3.png" style= "border : 2px solid cornflowerblue; border-radius:10px;"> </p>  
3. Once the users has carried one of the different labels on the right hand side, they are able to drop them on the red highlighted fields on the left:
    <p align="center"> <img src ="/markdown/src/image4.png" style= "border : 2px solid cornflowerblue; border-radius:10px;"> </p>  
4. The user can now successfully see the redered processable text that has been dragged from the file onto to the fields on the right. A full demonstration can be seen below:
    <p align="center"> <img src ="/markdown/src/2023-07-09 22-08-42.gif" style= "border : 2px solid cornflowerblue; border-radius:10px;"> </p>  

Users are able to specifically decide which texts belong to what headers with the use of the drag and drop feature.


### Automatic
> Only avilable for 2d datatypes

For automatic, the user simply needs to press automatic and allows MetaDB to make predictions on what texts belong to the different headers. The user needs to simply click a single button and let MetaDB handle all the predictions

1. On the page after submitting, user can see a list of headers on the left side of the page. For automatic, the input fields are already automatically filled. On the right side, user can find the data uploaded, they can see the overall layout.:
    <p align="center"> <img src ="/markdown/src/image.png" style= "border : 2px solid cornflowerblue; border-radius:10px;"> </p>  
2. From there, the user is able to check with the drop down to make sure if the automatic predictions are correct or if the user wants to change them manually like so:
    <p align="center"> <img src ="/markdown/src/image2.png" style= "border : 2px solid cornflowerblue; border-radius:10px;"> </p>  

3. The user can now finally view their records after using the automatic feature for creating data.

## Make a new record

User also have the choice to use MetaDB as a platform to record their data. This allow user to just record the data live to MetaDB following the regulated format made by the Pusdatin ESDM.

1. When clicked, this pop up will be shown. User can input the data type, AFE number, KKKS name, Working Area, and Submission type.
    
 <p align="center"> <img src ="/markdown/src/Untitled%2021.png" style= "border : 2px solid cornflowerblue; border-radius:10px;"> </p>  

2. After clicking confirm, user will be redirected to the New Record page. In this page, user can change the KKKS name, working area, and submission type. User can also directly use the sheets shown to record new data. 

> For some data types, they have duplicates of `ba_long_name` and `ba_type`. There are `ba_long_name` and `ba_long_name_2` may share the same value but they do not have to, they are independent of each other. Same goes with `ba_type` and `ba_type_2`.
    
<p align="center"> <img src ="/markdown/src/Untitled%2022.png" style= "border : 2px solid cornflowerblue; border-radius:10px;"> </p> 

3. Once the user done with inputting, they can click on either `Save changes` or `Save and exit` button at the bottom of the page.
    - Save changes: user stays in this page, but the file will be uploaded to the database. User will not loose their progress.
    - Save and exit: data will be saved to the database, the user will be redirected to the main page.

<p align="center"> <img src ="/markdown/src/Untitled%2023.png" style= "border : 2px solid cornflowerblue; border-radius:10px;"> </p>

## Edit or update record

In this example, we will be using `print well report` datatype as an example. Other datatypes has similar work flow.

To access submitted record, user can navigate using the side navigation bar. For print well report, the data can be found under `Well Data` and go to `Printed Well Report` 

<p align="center"> <img src ="/markdown/src/Untitled%2024.png" style= "border : 2px solid cornflowerblue; border-radius:10px;"> </p>

The user is able to edit existing records that have already been created as well as view their created records that they have created in the past.

By clicking on the pencil icon, user can edit their record. User will be taken to an edit page that allow them to change the KKKS name, working area, submission type, and also the record itself. 

<p align="center"> <img src ="/markdown/src/Untitled%2025.png" style= "border : 2px solid cornflowerblue; border-radius:10px;"> </p>

## Download record

User able to download record into `xlxs` format by clicking on the download logo under the `Action` section.

<p align="center"> <img src ="/markdown/src/downloadbutton.png" style= "border : 2px solid cornflowerblue; border-radius:10px;"> </p>

The download button will individually download the record.

To download in bulk (records shares the same UWI or line name) user can click on the download button at the bottom of the page. It will pop up a search page where user can input the UWI or line name that they want to download, then the records that share the same UWI or line name will be displayed and user can easily download them all.

<p align="center"> <img src ="/markdown/src/bulkDownload.png" style= "border : 2px solid cornflowerblue; border-radius:10px;"> </p>

<p align="center"> <img src ="/markdown/src/bulkSearch.png" style= "border : 2px solid cornflowerblue; border-radius:10px;"> </p>

<p align="center"> <img src ="/markdown/src/searchResult.png" style= "border : 2px solid cornflowerblue; border-radius:10px;"> </p>

## Delete record

By clicking on the trash icon, user can remove the record from the database. This will permanently remove the record from the database. 

<p align="center"> <img src ="/markdown/src/deleteButton.png" style= "border : 2px solid cornflowerblue; border-radius:10px;">
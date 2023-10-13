# Yext Mobile Platform Starter

This repository is designed to be implemented in a client's account to provide them a limited set of platform functionality optimized for small viewports (mobile).

## Prerequisites

### Yext API Keys

This starter uses the Yext Management, Analytics, Reviews, and Social Posts APIs to mimic the functionality of the Yext platform. It also uses a Content API on the Reviews page to fetch some information about the entity that is being reviewed.

You will need to create a new app in the Yext developer console and add the following permissions:

| Endpoint                   | Permissions  |
| -------------------------- | ------------ |
| Entities (Management API)  | Read / Write |
| Locations (Management API) | Read / Write |
| Analytics                  | Read         |
| Reviews                    | Read / Write |
| Posts                      | Read / Write |
| Content API                | Read-Only    |

After you have created you API and applied the correct endpoints and permissions, add `YEXT_PUBLIC_YEXT_API_KEY` to your `.env` locally and to the branch settings of your account.

### Content API

As mentioned above, this project references a custom content API for fetching the related entity when on the reviews screen. You will need to configure the following content API in the client account:

**Settings**

| Name | Locations |
| ID | locations |
| Base URL | https://cdn.yextapis.com/v2/accounts/me/content/locations |
| Source | Content |

**Content Source Settings**

| Filter | Entity Types |
| Localization | Primary |
| ------------ | ------- |

**Fields**: id, name, address
**Indexed Fields**: id

### Cloudinary

Since this project does not have the ability to upload images to the Yext image server, it leverages Cloudinary to upload local image files. Cloudinary returns a public image url that can then be passed to the management API for for image upload.

To enable this functionality for the client, you will need to set up your own Cloudinary project. Then, you need to add your Cloudinary product environment and [upload preset](https://cloudinary.com/documentation/upload_presets) as the following environment variables:

- YEXT_PUBLIC_CLOUDINARY_ENV_NAME
- YEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

## Running this project

Once the above prerequistes are met, you can run the following command to run this project locally:

`npm run dev`

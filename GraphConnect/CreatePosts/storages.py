from storages.backends.gcloud import GoogleCloudStorage

class PublicMediaStorage(GoogleCloudStorage):
    def get_default_settings(self):
        settings = super().get_default_settings()
        settings["default_acl"] = "publicRead"
        return settings

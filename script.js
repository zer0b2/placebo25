import { smartCaptcha } from '../../services/smartcaptcha';
import { renderProcessing } from '../../services';
import { mapActions, mapGetters } from 'vuex';
import { filter } from '../../helpers';
import DeleteDialog from './dialogs/delete';
import UpdateDialog from './dialogs/update';
import _debounce from 'lodash/debounce';

export default {
    components: {
        'v-delete-dialog': DeleteDialog,
        'v-update-dialog': UpdateDialog,
    },

    data() {
        return {
            colorSchemes: [],
            captchaArr: [],

            page: 1,
            itemsPerPage: 25,
            itemsPerPageOptions: [25, 50, 100],

            search: '',
            debouncedSearch: '',

            staticFilter: null,
            savePaginationStateIsAllowed: false,

            dialogs: {
                deleting: {
                    visible: false,
                    id: '',
                },
                updating: {
                    visible: false,
                    model: smartCaptcha.models.captcha(),
                    update: false,
                },
            },
        };
    },
    watch: {
        search: _debounce(function () {
            this.debouncedSearch = this.search;
        }, 300),
    },

    computed: {
        ...mapGetters('pagination', ['getPageFromPagination']),

        headers() {
            return [
                { text: this.$t('smart_captcha_keys.table.id'), sortable: false },
                { text: this.$t('smart_captcha_keys.table.color_scheme'), sortable: false },
                { text: this.$t('smart_captcha_keys.table.client_token'), sortable: false },
                { text: this.$t('smart_captcha_keys.table.secret_token'), sortable: false },
                { text: '', sortable: false, width: 70 },
            ];
        },
    },

    mounted() {
        this.getCaptchaAll();
        this.getColorSchemes();
    },

    methods: {
        ...mapActions('notification', ['success', 'error']),
        ...mapActions('loader', ['start']),
        ...mapActions('pagination', ['setPageFromPagination']),

        setDefaultUserPaginationSettings({ page = this.page, itemsPerPage = this.itemsPerPage }) {
            this.page = page;
            this.itemsPerPage = itemsPerPage;
        },

        onPaginationUpdate({ page, itemsPerPage }) {
            if (this.savePaginationStateIsAllowed) {
                this.setPageFromPagination({
                    pageName: this.$route.path,
                    page,
                    itemsPerPage,
                });
            }
        },

        filter(_, search, item) {
            if (this.staticFilter) {
                return this.staticFilter.filter(item, search);
            }

            return true;
        },

        initializeFilter() {
            filter(this.services, (s) => {
                return [s.id, [s.attributes.color_scheme, s.attributes.client_token, s.attributes.secret_token]];
            }).then((f) => (this.staticFilter = f));
        },

        getCaptchaAll() {
            this.start(smartCaptcha.methods.getCaptchaAll()).then((resp) => {
                resp = resp.data.filter((item) => item !== null);
                this.captchaArr = resp;
            });
        },

        getColorSchemes() {
            this.start(renderProcessing.methods.getColorSchemesV2()).then((resp) => {
                for (let i = 0; i < resp.data.length; i++) {
                    this.colorSchemes.push(resp.data[i]);
                }
            });
        },

        applyModelUpdate() {
            if (this.dialogs.updating.update) {
                this.start(smartCaptcha.methods.updateCaptchaForColorSchema(this.dialogs.updating.model.id, this.dialogs.updating.model))
                    .then((resp) => {
                        this.captchaArr.forEach((captcha, key) => {
                            if (captcha.id === this.dialogs.updating.model.id) {
                                this.$set(this.captchaArr, key, resp.data);
                            }
                        });

                        this.dialogs.updating.visible = false;
                        this.dialogs.updating.model = {};
                        this.success(this.$t('smart_captcha_keys.dialogs.update.edited'));
                    })
                    .catch(this.error);
            } else {
                if (
                    this.captchaArr.filter((item) => item.attributes.color_schema === this.dialogs.updating.model.attributes.color_schema)
                        .length > 0
                ) {
                    this.error(this.$t('smart_captcha_keys.dialogs.already_exist'));
                } else {
                    this.start(smartCaptcha.methods.createCaptchaForColorSchema(this.dialogs.updating.model))
                        .then((resp) => {
                            this.captchaArr.push(resp.data);

                            this.dialogs.updating.model = {};
                            this.dialogs.updating.visible = false;

                            this.success(this.$t('smart_captcha_keys.dialogs.create.created'));
                        })
                        .catch(this.error);
                }
            }
        },

        applyModelDelete() {
            this.start(smartCaptcha.methods.deleteCaptcha(this.dialogs.deleting.id))
                .then(() => {
                    this.captchaArr = this.captchaArr.filter((e) => {
                        return e.id !== this.dialogs.deleting.id;
                    });

                    this.getCaptchaAll();
                    this.dialogs.deleting.id = '';
                    this.dialogs.deleting.visible = false;
                    this.success(this.$t('smart_captcha_keys.keys.dialogs.delete.deleted'));
                })
                .catch(this.error);
        },

        modelDelete(model) {
            this.dialogs.deleting.id = model.id;
            this.dialogs.deleting.visible = true;
        },

        modelEdit(model) {
            this.start(smartCaptcha.methods.getCaptchaById(model.id)).then((resp) => {
                this.dialogs.updating.model = JSON.parse(JSON.stringify(resp.data));
                this.dialogs.updating.visible = true;
                this.dialogs.updating.update = true;
            });
        },

        modalModelCreate() {
            this.dialogs.updating.model = smartCaptcha.models.captcha();
            this.dialogs.updating.update = false;
            this.dialogs.updating.visible = true;
        },

        closeDialog(type) {
            this.dialogs[type].visible = false;
            this.dialogs[type].model = {};
        },
    },
};

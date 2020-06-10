import React = require("react");

export interface IJsonAsAFormTSXProps {
    json: string,
}

export interface IJsonAsAFormTSXState extends React.ComponentState, IJsonAsAFormTSXProps {
}

export class JsonAsAFormTSX extends React.Component<IJsonAsAFormTSXProps, IJsonAsAFormTSXState> {

    public items: any[];

    constructor(props: IJsonAsAFormTSXProps) {
        super(props);

        this.items = new Array<any>();

        this.state = {
            json: this.props.json,
            Items: this.items
        };

        this.onLoad();
    }

    componentWillReceiveProps(props: IJsonAsAFormTSXProps) {

        this.items = new Array<any>();

        this.state = {
            json: this.props.json,
            Items: this.items
        };
        this.onLoad();
    }

    render(): JSX.Element {
        return <>
            {this.state.Items}
        </>;
    }

    onLoad = () => {
        let data = Object.assign({}, JSON.parse(this.state.json));
        this.renderJson(data);
    }

    renderJson(data: any) {

        Object.keys(data).forEach(key_ => {
            let value: any = data[key_];
            if (typeof (value) == "object") {
                this.items.push(<div className="jsonasaform_object">{key_}</div>);

                if (value instanceof Array)
                    value.forEach(key2_ => {
                        this.renderJson(key2_);
                    });
            }
            else {

                if (typeof value === "string" && value.indexOf("/Date(") > -1)
                    value = this.getDateFromAspNetFormat(value);

                this.items.push(<div><label className="jsonasaform_attribute_label">{key_}</label><input className="jsonasaform_attribute_value" value={value} /></div>);
            }
        });

        this.setState(
            {
                Items: this.items
            });
    }

    public getDateFromAspNetFormat(date: string): string {
        const re = /-?\d+/;
        const m = re.exec(date);
        return new Date(parseInt(m![0], 10)).toLocaleString();
    }
}
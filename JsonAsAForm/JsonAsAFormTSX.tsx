import React = require("react");
import ReactDOM = require("react-dom");

export interface IJsonAsAFormTSXProps {
    title: string,
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
            title: this.props.title,
            json: this.props.json,
            Items: this.items
        };

        this.onLoad();
    }

    render(): JSX.Element {
        return <div className="jsonasaform_object">
            <div className="jsonasaform_object_title">{this.state.title}</div>
            {this.state.Items}
        </div>;
    }

    onLoad = () => {
        let data = this.formatJson(this.state.json);

        try {
            data = Object.assign({}, JSON.parse(data));
        }
        catch (e) {
            data = JSON.parse("{ \"Invalid\": \"JSON\" }");
        }
        finally {
            this.renderJson(data);
        }
    }

    renderJson(data: any) {

        Object.keys(data).forEach(key_ => {
            let value: any = data[key_];
            if (typeof (value) == "object" && value instanceof Array) {
                const title = key_;
                value.forEach(item_ => {
                    this.items.push(React.createElement(JsonAsAFormTSX,
                        {
                            title: title,
                            json: JSON.stringify(item_)
                        }));
                });
            }
            else {
                if (typeof value === "string" && value.indexOf("/Date(") > -1)
                    value = this.getDateFromAspNetFormat(value);
                this.items.push(<div className="json_property"><label>{key_}</label><input value={value} /></div>);
            }
        });

        this.setState(
            {
                Items: this.items
            });
    }

    public formatJson(json: string): string {

        if (json) {
            if (json.startsWith("[") && json.endsWith("]"))
                return "{\"\":" + json + "}";
            else
                return json;
        }
        else
            return "{ \"\": \"\" }";

    }

    public getDateFromAspNetFormat(date: string): string {
        const re = /-?\d+/;
        const m = re.exec(date);
        return new Date(parseInt(m![0], 10)).toLocaleString();
    }
}
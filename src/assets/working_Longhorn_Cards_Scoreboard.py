#!/usr/bin/env python
# coding: utf-8

# In[1]:


import pandas as pd
import plotly.express as px
import plotly.io as pio
import plotly.graph_objects as go
from IPython.display import HTML
import base64
import dash
from dash import Dash, html, dcc
from dash.dependencies import Input, Output, State

pio.templates.default = 'simple_white'


# In[2]:


# OPEN LAST SAVED FILE
df = pd.read_excel(r'C:\Users\smith\OneDrive\Documents\Python_Scripts\Composite_Ranks.xlsx')
df = df.drop(df.columns[0], axis=1)

# Initialize the Dash app
columns_to_include = ['Technical Rank', 'Sentiment Rank', 'Composite Rank', 'Fundamental Rank',
                       '% from High', '% from Low', '% from 3-Mo Avg', '% from Avg']
sport_column = ['Sport']

app = dash.Dash(__name__)

# Layout of the Dash app
app.layout = html.Div([
    html.H1(f"Longhorn Cards Player Scoreboard as of May 2024", style={'color': 'peru', 'fontSize': 36}),
    html.Div([
        html.Label('X-axis:'),
        dcc.Dropdown(
            id='x_axis',
            options=[{'label': col, 'value': col} for col in columns_to_include if 'Technical Rank' in columns_to_include],
            value='Technical Rank'
        ),
    ]),
    html.Div([
        html.Label('Y-axis:'),
        dcc.Dropdown(
            id='y_axis',
            options=[{'label': col, 'value': col} for col in columns_to_include if 'Sentiment Rank' in columns_to_include],
            value='Sentiment Rank'
        ),
    ]),
    html.Div([
        html.Label('Color:'),
        dcc.Dropdown(
            id='color_var',
            options=[{'label': col, 'value': col} for col in columns_to_include if 'Composite Rank' in columns_to_include],
            value='Composite Rank'
        ),
    ]),
    html.Div([
        html.Label('Size:'),
        dcc.Dropdown(
            id='size_var',
            options=[{'label': col, 'value': col} for col in columns_to_include if 'Fundamental Rank' in columns_to_include],
            value='Fundamental Rank'
        ),
    ]),
    html.Div([
        html.Label('Sport:'),
        dcc.RadioItems(
            id='sport',
            options=['All', 'Football', 'Baseball', 'Basketball'],
            value='All',
            labelStyle={'display': 'inline-block'}
        ),
    ]),
    html.Div([
        html.Label('Trend:'),
        dcc.RadioItems(
            id='trend',
            options=['All', 'Strong Uptrend', 'Uptrend', 'Downtrend', 'Strong Downtrend'],
            value='All',
            labelStyle={'display': 'inline-block'}
        ),
    ]),
    html.Button("Export to HTML", id='export-button', n_clicks=0),  # Export button
    dcc.Graph(id='scatter-plot', style={'height': '800px'}
             )
])

# Callback to update the scatterplot
@app.callback(
    Output('scatter-plot', 'figure'),
    Input('x_axis', 'value'),
    Input('y_axis', 'value'),
    Input('color_var', 'value'),
    Input('size_var', 'value'),
    Input('sport', 'value'),
    Input('trend', 'value')
)

def update_scoreboard(x_axis, y_axis, color_var, size_var, sport, trend):
    filtered_df = df.copy()
    if sport != 'All':
        filtered_df = filtered_df[filtered_df['Sport'] == sport]
    if trend != 'All':
        filtered_df = filtered_df[filtered_df['Trend'] == trend]
    fig = px.scatter(filtered_df, x=x_axis, y=y_axis, color=color_var, size=size_var, hover_name = 'Name', text = 'Name',
                     title='<br><b>Longhorn Cards Scoreboard - May 2024<br>')
    fig.update_layout(
        autosize=False,
        width=900,  # Increase width
        height=700,  # Increase height
        margin=dict(l=60, r=60, b=125, t=125))
    fig.update_traces(textposition='top center')  # Position the text labels
    
    # Add crosshair lines
    fig.update_xaxes(
        showspikes=True, 
        spikemode='across', 
        spikecolor='black', 
        spikethickness=1
    )
    fig.update_yaxes(
        showspikes=True, 
        spikemode='across', 
        spikecolor='black', 
        spikethickness=1
    )
    fig.add_shape(
        type="rect",
        x0=0, y0=0, x1=0.5, y1=0.5,
        xref="paper", yref="paper",
        fillcolor="lightcoral",
        opacity=0.3,
        line_width=0,
    )
    fig.add_shape(
        type="rect",
        x0=0.5, y0=0, x1=1, y1=0.5,
        xref="paper", yref="paper",
        fillcolor="lightblue",
        opacity=0.3,
        line_width=0,
    )
    fig.add_shape(
        type="rect",
        x0=0, y0=0.5, x1=0.5, y1=1,
        xref="paper", yref="paper",
        fillcolor="lightyellow",
        opacity=0.3,
        line_width=0,
    )
    fig.add_shape(
        type="rect",
        x0=0.5, y0=0.5, x1=1, y1=1,
        xref="paper", yref="paper",
        fillcolor="lightgreen",
        opacity=0.3,
        line_width=0,
    )
    fig.update_layout(
        annotations=[
            go.layout.Annotation(
                text="<i>(Methodology Notes:  Composite Rank calculated from historical card prices (Technical Rank), player career statistics <br>(Fundamental Rank), and Google Trends interest (Sentiment Rank). Size of Bubble = Fundamental Rank.  As of May 2024.<i>)",
                xref='paper',
                yref='paper',
                x=0.5,
                y=-0.25,
                showarrow=False,
                font=dict(size=12))])
    
    logo = r"C:\Users\smith\OneDrive\Documents\Python_Scripts\LogoSimple.jpg"
    with open(logo, 'rb') as f:
        encoded_image=base64.b64encode(f.read()).decode()
    
    fig.add_layout_image(
        dict(
            source=f'data:image/jpeg;base64, {encoded_image}',
            xref='paper', yref='paper', x=1.1, y=1.2, sizex=0.3, sizey=0.3, xanchor='right', yanchor='top'))
    fig.update_layout(
    title={
        'font':  {'color': 'peru',
                 'size':  20}})
    return fig

@app.callback(
    Output('export-button', 'n_clicks'),
    Input('export-button', 'n_clicks'),
    State('scatter-plot', 'figure')
)

def export_to_html(n_clicks, fig):
    if n_clicks > 0:
        pio.write_html(fig, file='player_scoreboard_dash.html', auto_open=True)
    return 0  # Reset n_clicks after exporting

# Run the app
if __name__ == '__main__':
    app.run_server(debug=True)


# In[ ]:





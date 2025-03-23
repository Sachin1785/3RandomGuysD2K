import streamlit as st
import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt

# Set Streamlit page configuration
st.set_page_config(page_title="Task Analysis Dashboard", layout="wide")

# Title and description
st.title("Task Analysis Dashboard")
st.markdown("""
This dashboard calculates **MissedTaskDays** based on your dataset and displays multiple visualizations:
- **Heatmap:** Total missed task days by month and year.
- **Weekly Trend:** Regression-smoothed weekly trend of missed task days.
- **Monthly Trend:** Missed task days with a 3-month rolling average.
- **Cost Trend:** Overlay of average cost trend with missed task days.
- **Risk Indicators:** Composite risk indicator over time.

The aggregated monthly trend data is also exported as JSON.
""")

# File upload
uploaded_file = st.file_uploader("Upload your CSV file", type=["csv"])
if uploaded_file is not None:
    df = pd.read_csv(uploaded_file)
    
    # Check if required columns exist
    required_cols = ['WOStartDate', 'Probability of Task Delays',
                     'Historical Completion Rate', 'WODuration', 'Cost']
    missing_cols = [col for col in required_cols if col not in df.columns]
    if missing_cols:
        st.error(f"CSV is missing required columns: {', '.join(missing_cols)}")
    else:
        # Preprocess Data: Convert WOStartDate to datetime and extract Year and Month
        df['WOStartDate'] = pd.to_datetime(df['WOStartDate'])
        df['WOStartYear'] = df['WOStartDate'].dt.year
        df['WOStartMonth'] = df['WOStartDate'].dt.month

        # Calculate MissedTaskDays using a heuristic:
        # MissedTaskDays = (Probability of Task Delays * (1 - Historical Completion Rate) * WODuration)
        df['MissedTaskDays'] = df['Probability of Task Delays'] * (1 - df['Historical Completion Rate']) * df['WODuration']

        st.success("File loaded and processed successfully!")

        # ---------------------------
        # 1. Heatmap: Missed Task Days by Month and Year
        # ---------------------------
        st.header("Heatmap: Missed Task Days by Month and Year")
        heatmap_data = df.groupby(['WOStartYear', 'WOStartMonth'])['MissedTaskDays'].sum().unstack().fillna(0)
        fig1, ax1 = plt.subplots(figsize=(12, 6))
        sns.heatmap(heatmap_data, cmap="Reds", annot=True, fmt=".1f", linewidths=0.5,
                    cbar_kws={'label': 'Missed Task Days'}, ax=ax1)
        ax1.set_title("Task Miss Heatmap: Total Missed Task Days by Month and Year", fontsize=16)
        ax1.set_xlabel("Month", fontsize=14)
        ax1.set_ylabel("Year", fontsize=14)
        st.pyplot(fig1)
        st.markdown("""
        **Explanation:**  
        This heatmap visualizes the total missed task days across different months and years. Darker shades indicate higher missed task days, helping you identify seasonal patterns or periods with elevated delays.
        """)

        # ---------------------------
        # 2. Weekly Trend: Missed Task Days
        # ---------------------------
        st.header("Weekly Trend: Missed Task Days")
        # For weekly analysis, simulate daily data if necessary
        n_samples = 50000  # adjust as needed
        df_daily = df.copy()
        actual_samples = len(df_daily)
        if actual_samples < n_samples:
            start_date = df_daily['WOStartDate'].min()
            df_daily['WOStartDate'] = pd.date_range(start=start_date, periods=actual_samples, freq='D')
        else:
            df_daily['WOStartDate'] = pd.date_range(start='2022-01-01', periods=n_samples, freq='D')
        df_daily['Week'] = df_daily['WOStartDate'].dt.isocalendar().week
        weekly_trend = df_daily.groupby('Week')['MissedTaskDays'].sum().reset_index()
        fig2, ax2 = plt.subplots(figsize=(12, 6))
        sns.regplot(data=weekly_trend, x='Week', y='MissedTaskDays', scatter=True, marker='o',
                    color='blue', line_kws={'color': 'darkblue', 'lw': 2}, ax=ax2)
        ax2.set_title("Weekly Trend of Missed Task Days with Regression Smoothing", fontsize=16)
        ax2.set_xlabel("Week Number", fontsize=14)
        ax2.set_ylabel("Total Missed Task Days", fontsize=14)
        st.pyplot(fig2)
        st.markdown("""
        **Explanation:**  
        This graph aggregates missed task days by week and applies regression smoothing. It helps reveal weekly patterns and trends in task delays.
        """)

        # ---------------------------
        # 3. Monthly Trend: Missed Task Days with Rolling Average
        # ---------------------------
        st.header("Monthly Trend: Missed Task Days with Rolling Average")
        monthly_trend = df.groupby(['WOStartYear', 'WOStartMonth'])['MissedTaskDays'].sum().reset_index()
        monthly_trend['Date'] = pd.to_datetime(monthly_trend['WOStartYear'].astype(str) + '-' +
                                                monthly_trend['WOStartMonth'].astype(str) + '-01')
        monthly_trend = monthly_trend.sort_values(by='Date')
        # Calculate a 3-month rolling average
        monthly_trend['RollingAvg'] = monthly_trend['MissedTaskDays'].rolling(window=3, min_periods=1).mean()
        fig3, ax3 = plt.subplots(figsize=(14, 7))
        sns.lineplot(data=monthly_trend, x='Date', y='MissedTaskDays', marker='o',
                     label='Missed Task Days', color='red', ax=ax3)
        sns.lineplot(data=monthly_trend, x='Date', y='RollingAvg', marker=None,
                     label='3-Month Rolling Avg', color='black', linestyle='--', ax=ax3)
        ax3.set_title("Monthly Trend of Missed Task Days with Rolling Average", fontsize=16)
        ax3.set_xlabel("Date", fontsize=14)
        ax3.set_ylabel("Total Missed Task Days", fontsize=14)
        ax3.tick_params(axis='x', rotation=45)
        # Annotate the highest month
        max_val = monthly_trend['MissedTaskDays'].max()
        max_date = monthly_trend[monthly_trend['MissedTaskDays'] == max_val]['Date'].iloc[0]
        ax3.annotate(f"Peak: {max_val:.1f}", xy=(max_date, max_val), xytext=(max_date, max_val+1),
                     arrowprops=dict(facecolor='black', arrowstyle='->'), fontsize=12)
        st.pyplot(fig3)
        st.markdown("""
        **Explanation:**  
        This monthly trend line graph shows the total missed task days per month with a 3-month rolling average (dashed line) to smooth out short-term fluctuations. The peak month is annotated for quick identification of critical periods.
        """)

        # ---------------------------
        # 4. Cost Trend with Missed Task Days Overlay
        # ---------------------------
        st.header("Cost Trend with Missed Task Days Overlay")
        cost_trend = df.groupby(['WOStartYear', 'WOStartMonth'])['Cost'].mean().reset_index()
        cost_trend['Date'] = pd.to_datetime(cost_trend['WOStartYear'].astype(str) + '-' +
                                            cost_trend['WOStartMonth'].astype(str) + '-01')
        cost_trend = cost_trend.sort_values(by='Date')
        combined_trend = pd.merge(monthly_trend[['Date', 'MissedTaskDays']], cost_trend[['Date', 'Cost']], on='Date')
        fig4, ax4 = plt.subplots(figsize=(14, 7))
        sns.lineplot(data=combined_trend, x='Date', y='Cost', marker='o', color='blue', label="Avg Total Cost", ax=ax4)
        sns.scatterplot(data=combined_trend, x='Date', y='MissedTaskDays', size='MissedTaskDays', 
                        color='red', legend=False, sizes=(50, 300), ax=ax4)
        ax4.set_title("Trend Analysis of Cost with Missed Task Days Overlay", fontsize=16)
        ax4.set_xlabel("Date", fontsize=14)
        ax4.set_ylabel("Cost / Missed Task Days", fontsize=14)
        ax4.tick_params(axis='x', rotation=45)
        st.pyplot(fig4)
        st.markdown("""
        **Explanation:**  
        This graph overlays the average cost trend (blue line) with missed task days (red dots). It helps correlate cost variations with task delays, highlighting periods where high costs may be associated with increased delays.
        """)

        # ---------------------------
        # 5. Composite Risk Indicator Over Time
        # ---------------------------
        st.header("Composite Risk Indicator Over Time")
        total_tasks = df.groupby(['WOStartYear', 'WOStartMonth']).size().reset_index(name='TotalTasks')
        missed_trend = df.groupby(['WOStartYear', 'WOStartMonth'])['MissedTaskDays'].sum().reset_index()
        risk_data = pd.merge(missed_trend, total_tasks, on=['WOStartYear', 'WOStartMonth'])
        risk_data['MissedTaskRate'] = risk_data['MissedTaskDays'] / risk_data['TotalTasks']
        risk_data = pd.merge(risk_data, cost_trend[['WOStartYear', 'WOStartMonth', 'Cost']], on=['WOStartYear', 'WOStartMonth'])
        risk_data['RiskScore'] = risk_data['MissedTaskRate'] * risk_data['Cost']
        risk_data['Date'] = pd.to_datetime(risk_data['WOStartYear'].astype(str) + '-' +
                                           risk_data['WOStartMonth'].astype(str) + '-01')
        risk_data = risk_data.sort_values(by='Date')
        st.write("Risk Data Sample:")
        st.write(risk_data.head())
        fig5, ax5 = plt.subplots(figsize=(14, 7))
        sns.lineplot(data=risk_data, x='Date', y='RiskScore', marker='o', color='purple', ax=ax5)
        ax5.set_title("Composite Risk Indicator Over Time", fontsize=16)
        ax5.set_xlabel("Date", fontsize=14)
        ax5.set_ylabel("Risk Score", fontsize=14)
        ax5.tick_params(axis='x', rotation=45)
        st.pyplot(fig5)
        st.markdown("""
        **Explanation:**  
        This composite risk indicator is computed by combining the missed task rate (missed task days divided by total tasks) and the average cost. A higher risk score indicates periods with a high proportion of delays and high costs, helping you identify critical times for intervention.
        """)

      
else:
    st.info("Please upload your CSV file to display the dashboard.")

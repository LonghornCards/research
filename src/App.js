import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { Link } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-top: 70px; /* Adjust to prevent content from being hidden by the navbar */
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const LogoImage = styled.img`
  width: 400px; /* Adjust size as needed */
  margin-right: 20px;
`;

const TextBox = styled.h1`
  color: peru;
  font-weight: bold;
  font-size: 2rem; /* Adjust the font size as needed */
`;

const SubTextBox = styled.h2`
  color: peru;
  margin-top: 10px;
`;

const BlogContainer = styled.div`
  margin-top: 40px;
  width: 80%;
  max-width: 600px;
  text-align: left;
`;

const BlogTitle = styled.h2`
  color: peru;
  font-weight: bold;
`;

const BlogDate = styled.p`
  color: grey;
  font-style: italic;
`;

const BlogSummary = styled.p`
  color: black;
`;

const BlogImage = styled.img`
  max-width: 100%;
  height: auto;
  margin-top: 10px;
`;

const BlogHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BlogHeaderTitle = styled.h2`
  color: peru;
  font-weight: bold;
`;

const BlogLink = styled(Link)`
  color: peru;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const App = () => {
    const [mostRecentBlog, setMostRecentBlog] = useState(null);

    useEffect(() => {
        const fetchBlogData = async () => {
            try {
                const response = await axios.get('https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog.xlsx', {
                    responseType: 'arraybuffer'
                });
                const data = new Uint8Array(response.data);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

                // Explicitly parse the date string to ensure correct date format
                worksheet.forEach(row => {
                    if (row.Date) {
                        row.Date = new Date((row.Date - (25567 + 1)) * 86400 * 1000); // Excel date conversion
                    }
                });

                const sortedBlogs = worksheet.sort((a, b) => new Date(b.Date) - new Date(a.Date));
                setMostRecentBlog(sortedBlogs[0]);
            } catch (error) {
                console.error('Error fetching the blog data:', error);
            }
        };

        fetchBlogData();
    }, []);

    return (
        <Container>
            <Header>
                <LogoImage src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Logo_Simple.png" alt="Logo" />
                <TextBox>Welcome to Longhorn Cards Research!</TextBox>
            </Header>
            <SubTextBox>Under Construction</SubTextBox>
            {mostRecentBlog && (
                <BlogContainer>
                    <BlogHeader>
                        <BlogHeaderTitle>Most Recent Blog Post</BlogHeaderTitle>
                        <BlogLink to="/page_blog">View All Blogs</BlogLink>
                    </BlogHeader>
                    <BlogTitle>{mostRecentBlog.Title}</BlogTitle>
                    <BlogDate>{mostRecentBlog.Date.toLocaleDateString()}</BlogDate>
                    <BlogSummary>{mostRecentBlog.Summary}</BlogSummary>
                    {mostRecentBlog.Image && <BlogImage src={mostRecentBlog.Image} alt={mostRecentBlog.Title} />}
                </BlogContainer>
            )}
        </Container>
    );
};

export default App;
